from fastapi.testclient import TestClient
import pytest
from backend.main import create_app


class MockRedis:
    def __init__(self):
        # store some sample values
        self.store = {
            # list-like stored as Redis list (strings representing JSON objects)
            "institutions": ['{"id": 1, "name": "Uni A"}', '{"id": 2, "name": "Uni B"}'],
            # stringified JSON
            "companies": '["C1", "C2"]',
            # set-like
            "roles": set([b"admin", b"user"]),
            # empty
            "degrees": None,
        }

    async def execute_command(self, *args, **kwargs):
        # pretend RedisJSON not available
        raise Exception("JSON module not available")

    async def get(self, key):
        return self.store.get(key)

    async def lrange(self, key, start, end):
        val = self.store.get(key)
        if isinstance(val, list):
            return [s.encode() if isinstance(s, str) else s for s in val]
        return []

    async def smembers(self, key):
        val = self.store.get(key)
        if isinstance(val, set):
            return val
        return set()

    async def ping(self):
        return True

    async def close(self):
        pass


@pytest.fixture
def client(monkeypatch):
    app = create_app()
    # inject the mock redis client
    app.state.redis = MockRedis()
    return TestClient(app)


def test_institutions(client):
    r = client.get("/institutions")
    assert r.status_code == 200
    data = r.json()
    assert data["count"] == 2


def test_companies(client):
    r = client.get("/companies")
    assert r.status_code == 200
    data = r.json()
    assert data["count"] == 2


def test_roles(client):
    r = client.get("/roles")
    assert r.status_code == 200
    data = r.json()
    # roles set has 2 members
    assert data["count"] == 2


def test_degrees_empty(client):
    r = client.get("/degrees")
    assert r.status_code == 200
    data = r.json()
    assert data["count"] == 0
