import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# When deployed on Vercel, routers live in backend package
try:
    from backend.auth import router as auth_router
    from backend.profiles import router as profiles_router
    from backend.applications import router as applications_router
except ImportError:
    from auth import router as auth_router
    from profiles import router as profiles_router
    from applications import router as applications_router

app = FastAPI(
    title="RentReady API",
    description="Backend for the RentReady rental application platform",
    version="1.0.0",
)

FRONTEND_URL = os.getenv("FRONTEND_URL", "")

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://*.vercel.app",
]
if FRONTEND_URL:
    origins.append(FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(profiles_router)
app.include_router(applications_router)


@app.get("/")
def root():
    return {"message": "RentReady API is running", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
