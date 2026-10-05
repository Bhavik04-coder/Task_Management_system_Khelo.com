import React, { useState, useEffect, useCallback } from "react";
import { Plus, CheckSquare, ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";
import { taskService } from "../services/taskService";
import { useToast } from "../context/ToastContext";
import TaskCard from "../components/tasks/TaskCard";
import TaskFilterBar from "../components/tasks/TaskFilterBar";
import TaskFormModal from "../components/tasks/TaskFormModal";
import DeleteConfirmModal from "../components/common/DeleteConfirmModal";
import Button from "../components/common/Button";
import { TaskCardSkeleton } from "../components/common/Skeleton";

export default function Tasks() {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 9;

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    due_date: "",
    search: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page,
        limit,
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.due_date && { due_date: filters.due_date }),
        ...(filters.search.trim() && { search: filters.search.trim() }),
      };

      const res = await taskService.getTasks(params);
      if (res.success && res.data) {
        setTasks(res.data.tasks || []);
        setTotal(res.data.total || 0);
      }
    } catch (err) {
      setError(err.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({ status: "", priority: "", due_date: "", search: "" });
    setPage(1);
  };

  // Create Task
  const handleCreateTask = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      showToast("Task created successfully!", "success");
      fetchTasks();
    } catch (err) {
      showToast(err.message || "Failed to create task", "error");
    }
  };

  // Update Task
  const handleUpdateTask = async (taskData) => {
    if (!taskToEdit) return;
    try {
      await taskService.updateTask(taskToEdit.id, taskData);
      showToast("Task updated successfully!", "success");
      setTaskToEdit(null);
      fetchTasks();
    } catch (err) {
      showToast(err.message || "Failed to update task", "error");
    }
  };

  // Quick Status Change
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      showToast(`Status updated to "${newStatus}"`, "info");
      fetchTasks();
    } catch (err) {
      showToast(err.message || "Failed to update status.", "error");
    }
  };

  // Delete Task
  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    setDeleteLoading(true);
    try {
      await taskService.deleteTask(taskToDelete.id);
      showToast("Task deleted successfully", "success");
      setTaskToDelete(null);
      fetchTasks();
    } catch (err) {
      showToast(err.message || "Failed to delete task.", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Tasks</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">Organize, filter, and track all your tasks ({total} total)</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>Add Task</Button>
      </div>

      <TaskFilterBar filters={filters} onFilterChange={handleFilterChange} onResetFilters={handleResetFilters} />

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <TaskCardSkeleton key={i} />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
          <CheckSquare className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No tasks found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-5">
            {filters.status || filters.priority || filters.due_date || filters.search
              ? "No tasks match your active filters. Try resetting the filters."
              : "You haven't created any tasks yet. Create one to get started!"}
          </p>
          {filters.status || filters.priority || filters.due_date || filters.search ? (
            <Button variant="secondary" size="sm" icon={RefreshCw} onClick={handleResetFilters}>Reset Filters</Button>
          ) : (
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>Create First Task</Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onEdit={(t) => setTaskToEdit(t)}
                onDelete={(t) => setTaskToDelete(t)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-700">
              <p>Showing Page <span className="text-brand-600">{page}</span> of <span className="text-slate-900">{totalPages}</span> ({total} tasks)</p>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" icon={ChevronLeft} disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
                <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next <ChevronRight className="w-4 h-4 ml-1 inline" /></Button>
              </div>
            </div>
          )}
        </>
      )}

      <TaskFormModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreateTask} title="Create New Task" />
      <TaskFormModal isOpen={!!taskToEdit} onClose={() => setTaskToEdit(null)} onSubmit={handleUpdateTask} initialData={taskToEdit} title="Edit Task" />
      <DeleteConfirmModal isOpen={!!taskToDelete} onClose={() => setTaskToDelete(null)} onConfirm={handleDeleteConfirm} loading={deleteLoading} message={`Are you sure you want to delete "${taskToDelete?.title}"?`} />
    </div>
  );
}
