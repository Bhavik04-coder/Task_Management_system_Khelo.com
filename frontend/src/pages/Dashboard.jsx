import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  PlayCircle,
  AlertTriangle,
  Flame,
  Plus,
  ArrowRight,
  Calendar,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { taskService } from "../services/taskService";
import StatCard from "../components/dashboard/StatCard";
import { StatusBadge, PriorityBadge } from "../components/common/Badge";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import TaskFormModal from "../components/tasks/TaskFormModal";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_tasks: 0,
    pending_tasks: 0,
    in_progress_tasks: 0,
    completed_tasks: 0,
    high_priority_tasks: 0,
    overdue_tasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, tasksRes] = await Promise.all([
        taskService.getTaskStats(),
        taskService.getTasks({ limit: 5 }),
      ]);

      if (statsRes.success && statsRes.data?.stats) {
        setStats(statsRes.data.stats);
      }
      if (tasksRes.success && tasksRes.data?.tasks) {
        setRecentTasks(tasksRes.data.tasks);
      }
    } catch (err) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleCreateTask = async (taskData) => {
    await taskService.createTask(taskData);
    fetchDashboardData();
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      fetchDashboardData();
    } catch (err) {
      setError(err.message || "Failed to update status.");
    }
  };

  const completionRate = stats.total_tasks > 0
    ? Math.round((stats.completed_tasks / stats.total_tasks) * 100)
    : 0;

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.name || "Developer"}! 👋
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 font-medium">
            <Calendar className="w-4 h-4 text-slate-400" />
            {todayFormatted}
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-auto"
        >
          Create Task
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" color="text-brand-600" />
        </div>
      ) : (
        <>
          {/* Summary Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            <StatCard
              title="Total Tasks"
              value={stats.total_tasks}
              icon={CheckCircle2}
              color="brand"
              subtitle="All user tasks"
            />
            <StatCard
              title="Pending"
              value={stats.pending_tasks}
              icon={Clock}
              color="amber"
              subtitle="Awaiting start"
            />
            <StatCard
              title="In Progress"
              value={stats.in_progress_tasks}
              icon={PlayCircle}
              color="blue"
              subtitle="Actively working"
            />
            <StatCard
              title="Completed"
              value={stats.completed_tasks}
              icon={CheckCircle2}
              color="emerald"
              subtitle="Finished tasks"
            />
            <StatCard
              title="High Priority"
              value={stats.high_priority_tasks}
              icon={Flame}
              color="rose"
              subtitle={stats.overdue_tasks > 0 ? `${stats.overdue_tasks} overdue` : "Urgent tasks"}
            />
          </div>

          {/* Progress Overview Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Overall Completion Progress</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {stats.completed_tasks} of {stats.total_tasks} tasks completed
                </p>
              </div>
              <span className="text-2xl font-black text-brand-600">{completionRate}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {/* Recent Tasks Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Recent Tasks</h3>
                <p className="text-xs text-slate-500 mt-0.5">Recently created and updated tasks</p>
              </div>
              <Link
                to="/tasks"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentTasks.length === 0 ? (
              <div className="p-12 text-center">
                <CheckCircle2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-semibold text-slate-700">No tasks created yet</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  Create your first task to see progress metrics here.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Plus}
                  onClick={() => setIsModalOpen(true)}
                >
                  Create Task
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-sm text-slate-900">
                          {task.title}
                        </h4>
                        <StatusBadge status={task.status} />
                        <PriorityBadge priority={task.priority} />
                      </div>
                      {task.description && (
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                      {task.due_date && (
                        <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Due: {task.due_date}
                        </p>
                      )}
                    </div>

                    {/* Quick Status Dropdown */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="text-xs font-semibold rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Quick Task Creation Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
        title="Create New Task"
      />
    </div>
  );
}
