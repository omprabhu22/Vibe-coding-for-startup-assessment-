import os
import httpx
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
from database import get_admin_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

router = APIRouter(prefix="/applications", tags=["Applications"])


class ApplicationData(BaseModel):
    full_name: str
    email: str
    phone: str
    age: Optional[int] = None
    occupation: Optional[str] = None
    employment_status: Optional[str] = None
    weekly_income: Optional[float] = None
    visa_status: Optional[str] = None
    rental_budget: Optional[float] = None
    suburb: Optional[str] = None


async def _get_user_id(token: str) -> str:
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={"apikey": SUPABASE_ANON_KEY, "Authorization": f"Bearer {token}"},
        )
    if res.status_code != 200:
        raise HTTPException(401, "Invalid or expired token")
    return res.json()["id"]


@router.post("/")
async def submit_application(data: ApplicationData, authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    user_id = await _get_user_id(token)

    db = get_admin_client()
    payload = {**data.dict(), "user_id": user_id, "status": "submitted"}
    result = db.table("applications").insert(payload).execute()

    if not result.data:
        raise HTTPException(500, "Failed to submit application")

    return {"message": "Application submitted", "application": result.data[0]}


@router.get("/")
async def get_my_applications(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    user_id = await _get_user_id(token)

    db = get_admin_client()
    result = (
        db.table("applications")
        .select("*")
        .eq("user_id", user_id)
        .order("submitted_at", desc=True)
        .execute()
    )

    return result.data
