import os
import httpx
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
try:
    from backend.database import get_admin_client
except ImportError:
    from database import get_admin_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

router = APIRouter(prefix="/profiles", tags=["Profiles"])


class ProfileData(BaseModel):
    full_name: str
    phone: str
    age: Optional[int] = None
    bio: Optional[str] = None
    occupation: Optional[str] = None
    employment_status: Optional[str] = None
    weekly_income: Optional[float] = None
    visa_status: Optional[str] = None
    rental_budget: Optional[float] = None
    suburb: Optional[str] = None


async def _get_user_id(token: str) -> str:
    """Verify token with Supabase and return user id."""
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={"apikey": SUPABASE_ANON_KEY, "Authorization": f"Bearer {token}"},
        )
    if res.status_code != 200:
        raise HTTPException(401, "Invalid or expired token")
    return res.json()["id"]


@router.post("/")
async def save_profile(data: ProfileData, authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    user_id = await _get_user_id(token)

    db = get_admin_client()
    payload = {**data.dict(), "user_id": user_id}

    # Upsert — update if exists, insert if not
    result = db.table("profiles").upsert(payload, on_conflict="user_id").execute()

    if not result.data:
        raise HTTPException(500, "Failed to save profile")

    return {"message": "Profile saved", "profile": result.data[0]}


@router.get("/me")
async def get_my_profile(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    user_id = await _get_user_id(token)

    db = get_admin_client()
    result = db.table("profiles").select("*").eq("user_id", user_id).execute()

    if not result.data:
        raise HTTPException(404, "Profile not found")

    return result.data[0]
