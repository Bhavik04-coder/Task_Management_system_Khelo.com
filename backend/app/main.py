from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import get_settings
from app.routes.api import api_router

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    description="Production-style REST API for Task Management with FastAPI, SQLAlchemy, and MySQL.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API routes under /api
app.include_router(api_router)


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint to verify backend service status."""
    return {
        "success": True,
        "message": f"{settings.APP_NAME} is running healthy.",
        "data": {
            "status": "online",
            "environment": settings.APP_ENV
        }
    }
