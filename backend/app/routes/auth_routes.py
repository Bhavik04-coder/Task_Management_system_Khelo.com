from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.schemas.user_schema import UserCreate
from app.schemas.auth_schema import UserLogin
from app.schemas.common_schema import APIResponse
from app.helpers.jwt_helper import get_current_user
from app.helpers.response_helper import success_response
from app.controllers.auth_controller import AuthController

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    response_model=APIResponse[dict],
    summary="Register a new user account"
)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Registers a new user:
    - Validates email format and uniqueness.
    - Hashes password using bcrypt.
    - Persists user record and returns sanitized profile.
    """
    return AuthController.register(db=db, user_data=user_data)


@router.post(
    "/login",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[dict],
    summary="Authenticate and obtain JWT access token"
)
def login(
    login_data: UserLogin,
    db: Session = Depends(get_db)
):
    """
    Authenticates user credentials:
    - Validates password against stored bcrypt hash.
    - Generates signed JWT access token.
    - Returns token with bearer type and user profile.
    """
    return AuthController.login(db=db, login_data=login_data)


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[dict],
    summary="Logout user session"
)
def logout(
    current_user: User = Depends(get_current_user)
):
    """
    Logs out the authenticated user.
    Stateless JWT client should discard the token on the client side.
    """
    return success_response(
        message="User logged out successfully.",
        data={"user_id": current_user.id},
        status_code=200
    )
