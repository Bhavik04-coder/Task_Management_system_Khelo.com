from datetime import date
from typing import Optional, List, Tuple, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, func
from app.models.user import User
from app.models.task import Task
from app.schemas.task_schema import TaskCreate, TaskUpdate


class TaskService:
    """
    Service containing all Task CRUD operations, analytics, and business logic.
    Guarantees user isolation (users can only access/modify their own tasks).
    """

    @staticmethod
    def create_task(db: Session, user: User, task_data: TaskCreate) -> Task:
        """Creates and persists a new task assigned to the current user."""
        new_task = Task(
            title=task_data.title.strip(),
            description=task_data.description.strip() if task_data.description else None,
            status=task_data.status.value,
            priority=task_data.priority.value,
            due_date=task_data.due_date,
            user_id=user.id
        )
        db.add(new_task)
        db.commit()
        db.refresh(new_task)
        return new_task

    @staticmethod
    def get_user_tasks(
        db: Session,
        user_id: int,
        status_filter: Optional[str] = None,
        priority_filter: Optional[str] = None,
        due_date_filter: Optional[date] = None,
        search: Optional[str] = None,
        page: int = 1,
        limit: int = 10
    ) -> Tuple[List[Task], int]:
        """Fetches filtered, searched, and paginated tasks for a specific user."""
        query = db.query(Task).filter(Task.user_id == user_id)

        # Dynamic filtering
        if status_filter:
            query = query.filter(Task.status == status_filter)
        if priority_filter:
            query = query.filter(Task.priority == priority_filter)
        if due_date_filter:
            query = query.filter(Task.due_date == due_date_filter)
        if search and search.strip():
            search_term = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    Task.title.ilike(search_term),
                    Task.description.ilike(search_term)
                )
            )

        total = query.count()
        offset = (page - 1) * limit
        tasks = query.order_by(Task.created_at.desc()).offset(offset).limit(limit).all()

        return tasks, total

    @staticmethod
    def get_task_by_id_and_user(db: Session, task_id: int, user_id: int) -> Task:
        """Retrieves a task by ID while strictly verifying ownership."""
        task = db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task with ID {task_id} not found."
            )
        return task

    @staticmethod
    def get_task_with_user_join(db: Session, task_id: int, user_id: int) -> Task:
        """
        Retrieves a task with an ORM eager join on the User table.
        Demonstrates SQLAlchemy joinedload optimization.
        """
        task = db.query(Task).options(joinedload(Task.user)).filter(
            Task.id == task_id,
            Task.user_id == user_id
        ).first()

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task with ID {task_id} not found."
            )
        return task

    @staticmethod
    def get_task_stats(db: Session, user_id: int) -> Dict[str, int]:
        """
        Aggregates dashboard statistics for the authenticated user.
        Calculates total, pending, in-progress, completed, high-priority, and overdue task counts.
        """
        today = date.today()

        total = db.query(func.count(Task.id)).filter(Task.user_id == user_id).scalar() or 0
        pending = db.query(func.count(Task.id)).filter(Task.user_id == user_id, Task.status == "Pending").scalar() or 0
        in_progress = db.query(func.count(Task.id)).filter(Task.user_id == user_id, Task.status == "In Progress").scalar() or 0
        completed = db.query(func.count(Task.id)).filter(Task.user_id == user_id, Task.status == "Completed").scalar() or 0
        high_priority = db.query(func.count(Task.id)).filter(Task.user_id == user_id, Task.priority == "High").scalar() or 0
        overdue = db.query(func.count(Task.id)).filter(
            Task.user_id == user_id,
            Task.status != "Completed",
            Task.due_date < today
        ).scalar() or 0

        return {
            "total_tasks": total,
            "pending_tasks": pending,
            "in_progress_tasks": in_progress,
            "completed_tasks": completed,
            "high_priority_tasks": high_priority,
            "overdue_tasks": overdue
        }

    @staticmethod
    def update_task(
        db: Session,
        task_id: int,
        user_id: int,
        task_data: TaskUpdate
    ) -> Task:
        """Updates fields of an existing user task."""
        task = TaskService.get_task_by_id_and_user(db, task_id, user_id)

        if task_data.title is not None:
            task.title = task_data.title.strip()
        if task_data.description is not None:
            task.description = task_data.description.strip() if task_data.description else None
        if task_data.status is not None:
            task.status = task_data.status.value
        if task_data.priority is not None:
            task.priority = task_data.priority.value
        if task_data.due_date is not None:
            task.due_date = task_data.due_date

        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def update_task_status(
        db: Session,
        task_id: int,
        user_id: int,
        new_status: str
    ) -> Task:
        """Updates only the status field of a user task."""
        task = TaskService.get_task_by_id_and_user(db, task_id, user_id)
        task.status = new_status
        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def delete_task(db: Session, task_id: int, user_id: int) -> int:
        """Deletes a user task by ID."""
        task = TaskService.get_task_by_id_and_user(db, task_id, user_id)
        db.delete(task)
        db.commit()
        return task_id
