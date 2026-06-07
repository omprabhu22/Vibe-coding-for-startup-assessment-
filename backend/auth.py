import os
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
AUTH_URL = f"{SUPABASE_URL}/auth/v1" if SUPABASE_URL else None

router = APIRouter(prefix="/auth", tags=["Auth"])


class SignUpRequest(BaseModel):
    email: str
    password: str
    name: str = ""


class LoginRequest(BaseModel):
    email: str
    password: str


def _supabase_headers():
    return {"apikey": SUPABASE_ANON_KEY, "Content-Type": "application/json"}


@router.post("/signup")
async def signup(req: SignUpRequest):
    if not AUTH_URL:
        raise HTTPException(500, "Supabase not configured")

    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{AUTH_URL}/signup",
            headers=_supabase_headers(),
            json={"email": req.email, "password": req.password, "data": {"full_name": req.name}},
        )

    if res.status_code not in (200, 201):
        try:
            err = res.json()
            raw = err.get("msg", err.get("message", err.get("error_description", "Signup failed")))
        except Exception:
            raw = "Signup failed"
        # Make rate-limit error human-friendly
        if "rate limit" in raw.lower() or res.status_code == 429:
            raw = "Too many sign-up attempts. Please wait a minute and try again."
        raise HTTPException(res.status_code, raw)

    data = res.json()
    return {
        "access_token": data.get("access_token"),
        "user": {"id": data["user"]["id"], "email": data["user"]["email"],
                 "name": req.name},
    }


@router.post("/login")
async def login(req: LoginRequest):
    if not AUTH_URL:
        raise HTTPException(500, "Supabase not configured")

    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{AUTH_URL}/token?grant_type=password",
            headers=_supabase_headers(),
            json={"email": req.email, "password": req.password},
        )

    if res.status_code != 200:
        raise HTTPException(401, "Invalid email or password")

    data = res.json()
    user_meta = data["user"].get("user_metadata", {})
    return {
        "access_token": data["access_token"],
        "user": {
            "id": data["user"]["id"],
            "email": data["user"]["email"],
            "name": user_meta.get("full_name", data["user"]["email"]),
        },
    }
