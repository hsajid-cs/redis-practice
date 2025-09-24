from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import json
import redis.asyncio as redis
from dotenv import load_dotenv
from typing import Any, List

# Load environment variables from backend/.env if present
load_dotenv()

# Keep the common collection names but the API also exposes dynamic key access
ALLOWED_KEYS = {"institutions", "companies", "roles", "degrees"}


def create_app():
    app = FastAPI(title="Redis Lookup API")
    app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

    @app.on_event("startup")
    async def startup():
        # Prefer REDIS_URL (supports rediss:// for TLS). If missing, fall back to individual env vars.
        url = os.getenv("REDIS_URL")
        if not url:
            host = os.getenv("REDIS_HOST", "localhost")
            port = os.getenv("REDIS_PORT", "6379")
            username = os.getenv("REDIS_USERNAME")
            password = os.getenv("REDIS_PASSWORD")
            use_tls = os.getenv("REDIS_TLS", "").lower() in ("1", "true", "yes")
            scheme = "rediss" if use_tls else "redis"
            if username and password:
                url = f"{scheme}://{username}:{password}@{host}:{port}"
            elif password:
                url = f"{scheme}://:{password}@{host}:{port}"
            else:
                url = f"{scheme}://{host}:{port}/0"

        # decode_responses=True so responses are returned as str (easier handling)
        app.state.redis = redis.from_url(url, decode_responses=True)
        try:
            await app.state.redis.ping()
        except Exception as e:
            # If connection fails on startup we still let app run; endpoints will return 500 if client missing
            print("Warning: Redis ping failed at startup:\n", e)

    @app.on_event("shutdown")
    async def shutdown():
        r = getattr(app.state, "redis", None)
        if r:
            try:
                await r.close()
            except Exception:
                pass

    async def fetch_key(key: str) -> List[Any]:
        r = getattr(app.state, "redis", None)
        if not r:
            raise HTTPException(status_code=500, detail="Redis client not initialized")

        # 1) Try RedisJSON (JSON.GET)
        try:
            res = await r.execute_command("JSON.GET", key)
            if res is not None:
                # res is expected to be a JSON string
                if isinstance(res, (bytes, bytearray)):
                    res = res.decode()
                return json.loads(res)
        except Exception:
            # not available or failed -> fallback
            pass

        # 2) Try GET (stringified JSON)
        try:
            val = await r.get(key)
            if val:
                if isinstance(val, (bytes, bytearray)):
                    val = val.decode()
                try:
                    return json.loads(val)
                except Exception:
                    return [val]
        except Exception:
            pass

        # 3) Try list (LRANGE)
        try:
            items = await r.lrange(key, 0, -1)
            if items:
                out = []
                for it in items:
                    if isinstance(it, (bytes, bytearray)):
                        it = it.decode()
                    # try JSON decode, otherwise return raw string
                    try:
                        out.append(json.loads(it))
                    except Exception:
                        out.append(it)
                return out
        except Exception:
            pass

        # 4) Try set (SMEMBERS)
        try:
            items = await r.smembers(key)
            if items:
                out = []
                for it in items:
                    if isinstance(it, (bytes, bytearray)):
                        it = it.decode()
                    try:
                        out.append(json.loads(it))
                    except Exception:
                        out.append(it)
                return out
        except Exception:
            pass

        # 5) Try hash (HGETALL)
        try:
            h = await r.hgetall(key)
            if h:
                return h
        except Exception:
            pass

        # not found/empty
        return []

    @app.get("/keys")
    async def list_keys(pattern: str = "*"):
        r = getattr(app.state, "redis", None)
        if not r:
            raise HTTPException(status_code=500, detail="Redis client not initialized")
        try:
            ks = await r.keys(pattern)
            # ensure list of strings
            ks = [k.decode() if isinstance(k, (bytes, bytearray)) else k for k in ks]
            return {"count": len(ks), "keys": ks}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @app.get("/key/{keyname}")
    async def get_key(keyname: str):
        items = await fetch_key(keyname)
        return {"key": keyname, "count": len(items), "items": items}

    # keep the friendly collection endpoints but after the generic ones so they don't clash
    @app.get("/{collection}")
    async def get_collection(collection: str):
        if collection not in ALLOWED_KEYS:
            raise HTTPException(status_code=404, detail="collection not found")
        import time
        t0 = time.perf_counter()
        items = await fetch_key(collection)
        t1 = time.perf_counter()
        server_time_ms = int((t1 - t0) * 1000)
        return {"count": len(items), "items": items, "serverTimeMs": server_time_ms}

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    # When running this file directly from the backend folder (python main.py)
    # import path should be "main:app" so the reloader can import correctly.
    # You can also run from the repo root with: uvicorn backend.main:app --reload
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
