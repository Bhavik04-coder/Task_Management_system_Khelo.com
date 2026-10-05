from fastapi import APIRouter
from app.routes.auth_routes import router as auth_router
from app.routes.user_routes import router as user_router
from app.routes.task_routes import router as task_router

api_router = APIRouter(prefix="/api")

# Register module sub-routers
api_router.include_router(auth_router)
api_router.include_router(user_router)
api_router.include_router(task_router)
