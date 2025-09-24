Redis-backed FastAPI service

This small backend exposes four endpoints that fetch lists from Redis:
- /institutions
- /companies
- /roles
- /degrees

How data is read (fallback order):
1) RedisJSON (JSON.GET)
2) GET (string containing JSON array)
3) LRANGE (list elements)
4) SMEMBERS (set members)

Environment
- REDIS_URL: Redis connection URL (defaults to redis://localhost:6379/0). For Redis Cloud use your provided rediss:// URL.

Quick start (Windows cmd.exe)

1) install dependencies
```
python -m pip install -r backend\requirements.txt
```

2) set your Redis URL (example)
```
set REDIS_URL=rediss://:PASSWORD@HOST:PORT
```

3) run the app
```
python backend\main.py
```

Or with uvicorn (auto-reload during development):
```
uvicorn backend.main:app --reload
```

Notes
- The service tolerates Redis not being available at startup; endpoints will return a 500 if the client isn't initialized.
- Data format: each collection key may be stored as RedisJSON, a JSON string, a Redis List (one item per element), or a Redis Set. Items that are JSON will be parsed.
