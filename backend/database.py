import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    print("⚠️  WARNING: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set.")

def get_admin_client() -> Client:
    """Supabase client with service role key — bypasses RLS for backend writes."""
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

def get_anon_client() -> Client:
    """Supabase client with anon key — used for auth proxying."""
    return create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
