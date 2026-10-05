from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.schemas.task_schema import TaskCreate, TaskUpdate, TaskStatusUpdate
from app.schemas.common_schema import APIResponse
from app.helpers.jwt_helper import get_current_user
from app.controllers.task_controller import TaskController

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=APIResponse[dict],
    summary="Create a new task"
)
def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Creates a new task for the currently authenticated user."""
    return TaskController.create_task(db=db, current_user=current_user, task_data=task_data)


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[dict],
    summary="Get all tasks for current user"
)
def list_tasks(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status ('Pending', 'In Progress', 'Completed')"),
    priority_filter: Optional[str] = Query(None, alias="priority", description="Filter by priority ('Low', 'Medium', 'High')"),
    due_date_filter: Optional[date] = Query(None, alias="due_date", description="Filter by due date (YYYY-MM-DD)"),
    search: Optional[str] = Query(None, description="Search term for title or description"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves paginated and filtered tasks belonging to the current user."""
    return TaskController.list_tasks(
        db=db,
        current_user=current_user,
        status_filter=status_filter,
        priority_filter=priority_filter,
        due_date_filter=due_date_filter,
        search=search,
        page=page,
        limit=limit
    )


@router.get(
    "/stats",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[dict],
    summary="Get task analytics and metrics"
)
def get_task_statistics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves total, pending, in-progress, completed, and high-priority metrics."""
    return TaskController.get_stats(db=db, current_user=current_user)


@router.get(
    "/{task_id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[dict],
    summary="Get a single task by ID"
)
def get_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves a specific task by ID with joined user details."""
    return TaskController.get_task(db=db, current_user=current_user, task_id=task_id)


@router.put(
    "/{task_id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[dict],
    summary="Update a task"
)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates a task if owned by the current user."""
    return TaskController.update_task(
        db=db,
        current_user=current_user,
        task_id=task_id,
        task_data=task_data
    )


@router.patch(
    "/{task_id}/status",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[dict],
    summary="Update task status"
)
def update_task_status(
    task_id: int,
    status_data: TaskStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates only the status of a task."""
    return TaskController.update_status(
        db=db,
        current_user=current_user,
        task_id=task_id,
        status_data=status_data
    )


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_200_OK,
    response_model=APIResponse[dict],
    summary="Delete a task"
)
def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deletes a task if owned by the current user."""
    return TaskController.delete_task(
        db=db,
        current_user=current_user,
        task_id=task_id
    )
