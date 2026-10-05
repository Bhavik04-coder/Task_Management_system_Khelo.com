from sqlalchemy.orm import Session
from app.services.auth_service import AuthService
from app.schemas.user_schema import UserCreate, UserResponse
from app.schemas.auth_schema import UserLogin
from app.helpers.response_helper import success_response


class AuthController:
    """
    Controller handling HTTP requests and formatting responses for authentication.
    """

    @staticmethod
    def register(db: Session, user_data: UserCreate) -> dict:
        """
        Handles user registration requests.
        """
        user = AuthService.register_user(db, user_data)
        user_response = UserResponse.model_validate(user).model_dump(mode="json")

        return success_response(
            message="User registered successfully",
            data={"user": user_response},
            status_code=201
        )

    @staticmethod
    def login(db: Session, login_data: UserLogin) -> dict:
        """
        Handles user login requests and formats JWT response.
        """
        auth_result = AuthService.login_user(db, login_data)
        user_response = UserResponse.model_validate(auth_result["user"]).model_dump(mode="json")

        return success_response(
            message="Login successful",
            data={
                "access_token": auth_result["access_token"],
                "token_type": auth_result["token_type"],
                "user": user_response
            },
            status_code=200
        )
