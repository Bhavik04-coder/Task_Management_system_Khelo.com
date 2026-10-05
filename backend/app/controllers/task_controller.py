from datetime import date
from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.task_schema import (
    TaskCreate, TaskUpdate, TaskStatusUpdate,
    TaskResponse, TaskDetailResponse, TaskStatsResponseData
)
from app.services.task_service import TaskService
from app.helpers.response_helper import success_response


class TaskController:
    """
    Controller handling HTTP requests and formatting responses for Task operations.
    """

    @staticmethod
    def create_task(db: Session, current_user: User, task_data: TaskCreate) -> dict:
        """Creates a new task for the current user."""
        task = TaskService.create_task(db, current_user, task_data)
        task_response = TaskResponse.model_validate(task).model_dump(mode="json")
        return success_response(
            message="Task created successfully.",
            data={"task": task_response},
            status_code=201
        )

    @staticmethod
    def list_tasks(
        db: Session,
        current_user: User,
        status_filter: Optional[str] = None,
        priority_filter: Optional[str] = None,
        due_date_filter: Optional[date] = None,
        search: Optional[str] = None,
        page: int = 1,
        limit: int = 10
    ) -> dict:
        """Retrieves a filtered and paginated list of tasks for the current user."""
        tasks, total = TaskService.get_user_tasks(
            db=db,
            user_id=current_user.id,
            status_filter=status_filter,
            priority_filter=priority_filter,
            due_date_filter=due_date_filter,
            search=search,
            page=page,
            limit=limit
        )
        task_responses = [TaskResponse.model_validate(t).model_dump(mode="json") for t in tasks]
        return success_response(
            message="Tasks retrieved successfully.",
            data={
                "tasks": task_responses,
                "total": total,
                "page": page,
                "limit": limit
            },
            status_code=200
        )

    @staticmethod
    def get_stats(db: Session, current_user: User) -> dict:
        """Retrieves task analytics and summary counts for the current user."""
        stats = TaskService.get_task_stats(db, current_user.id)
        validated_stats = TaskStatsResponseData.model_validate(stats).model_dump(mode="json")
        return success_response(
            message="Task statistics retrieved successfully.",
            data={"stats": validated_stats},
            status_code=200
        )

    @staticmethod
    def get_task(db: Session, current_user: User, task_id: int) -> dict:
        """Retrieves a single task by ID with joined owner information."""
        task = TaskService.get_task_with_user_join(db, task_id, current_user.id)
        task_response = TaskDetailResponse.model_validate(task).model_dump(mode="json")
        return success_response(
            message="Task retrieved successfully.",
            data={"task": task_response},
            status_code=200
        )

    @staticmethod
    def update_task(
        db: Session,
        current_user: User,
        task_id: int,
        task_data: TaskUpdate
    ) -> dict:
        """Updates an existing task for the current user."""
        task = TaskService.update_task(db, task_id, current_user.id, task_data)
        task_response = TaskResponse.model_validate(task).model_dump(mode="json")
        return success_response(
            message="Task updated successfully.",
            data={"task": task_response},
            status_code=200
        )

    @staticmethod
    def update_status(
        db: Session,
        current_user: User,
        task_id: int,
        status_data: TaskStatusUpdate
    ) -> dict:
        """Updates only the status of a specific task."""
        task = TaskService.update_task_status(db, task_id, current_user.id, status_data.status.value)
        task_response = TaskResponse.model_validate(task).model_dump(mode="json")
        return success_response(
            message="Task status updated successfully.",
            data={"task": task_response},
            status_code=200
        )

    @staticmethod
    def delete_task(db: Session, current_user: User, task_id: int) -> dict:
        """Deletes a task owned by the current user."""
        deleted_id = TaskService.delete_task(db, task_id, current_user.id)
        return success_response(
            message="Task deleted successfully.",
            data={"task_id": deleted_id},
            status_code=200
        )
