from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user_schema import UserUpdate, UserResponse
from app.services.user_service import UserService
from app.helpers.response_helper import success_response


class UserController:
    """
    Controller handling HTTP requests for user profile operations.
    """

    @staticmethod
    def get_me(current_user: User) -> dict:
        """
        Returns profile data of the currently authenticated user.
        """
        user_response = UserResponse.model_validate(current_user).model_dump(mode="json")
        return success_response(
            message="User profile retrieved successfully",
            data={"user": user_response},
            status_code=200
        )

    @staticmethod
    def update_me(
        db: Session,
        current_user: User,
        update_data: UserUpdate
    ) -> dict:
        """
        Updates profile data of the currently authenticated user.
        """
        updated_user = UserService.update_user_profile(db, current_user, update_data)
        user_response = UserResponse.model_validate(updated_user).model_dump(mode="json")
        return success_response(
            message="Profile updated successfully",
            data={"user": user_response},
            status_code=200
        )
