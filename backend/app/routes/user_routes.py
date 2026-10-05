from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.schemas.user_schema import UserUpdate
from app.schemas.common_schema import APIResponse
from app.helpers.jwt_helper import get_current_user
from app.controllers.user_controller import UserController

router = APIRouter(prefix="/users", tags=["Users"])


@router.get(
    "/me",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[dict],
    summary="Get current user profile"
)
def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Returns the authenticated user's profile details.
    Requires Authorization: Bearer <JWT>
    """
    return UserController.get_me(current_user=current_user)


@router.put(
    "/me",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[dict],
    summary="Update current user profile"
)
def update_current_user_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Updates the authenticated user's name, email, or password.
    Requires Authorization: Bearer <JWT>
    """
    return UserController.update_me(
        db=db,
        current_user=current_user,
        update_data=update_data
    )
