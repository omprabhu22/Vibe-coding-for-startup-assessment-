import sys
import os

# Make backend package importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from backend.main import app  # noqa: F401 — Vercel picks up `app` as ASGI handler
