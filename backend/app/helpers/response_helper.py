from typing import Any, Optional
from fastapi.responses import JSONResponse


def success_response(
    message: str = "Operation completed successfully",
    data: Optional[Any] = None,
    status_code: int = 200
) -> dict:
    """
    Constructs a standardized dictionary for successful JSON responses.
    
    :param message: Human-readable message describing the outcome.
    :param data: The payload data (dict, list, or primitive).
    :param status_code: HTTP status code (default: 200).
    :return: Formatted dictionary conforming to the standard API response structure.
    """
    return {
        "success": True,
        "message": message,
        "data": data if data is not None else {}
    }


def error_response(
    message: str = "An error occurred",
    errors: Optional[Any] = None,
    status_code: int = 400
) -> JSONResponse:
    """
    Constructs a standardized JSONResponse object for error conditions.
    
    :param message: Error message.
    :param errors: Detailed validation or field error list/dict.
    :param status_code: HTTP status code (400, 401, 403, 404, 422, 500).
    :return: FastAPI JSONResponse instance.
    """
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "message": message,
            "errors": errors
        }
    )
