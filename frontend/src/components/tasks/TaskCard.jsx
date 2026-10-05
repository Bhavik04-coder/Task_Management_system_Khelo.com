import React from "react";
import { Calendar, Edit2, Trash2, Clock, AlertCircle } from "lucide-react";
import { StatusBadge, PriorityBadge } from "../common/Badge";
import { TASK_STATUSES } from "../../utils/constants";

export default function TaskCard({ task, onStatusChange, onEdit, onDelete }) {
  const isOverdue =
    task.due_date &&
    task.status !== TASK_STATUSES.COMPLETED &&
    new Date(task.due_date) < new Date(new Date().setHours(0, 0, 0, 0));

  const formattedDueDate = task.due_date
    ? new Date(task.due_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4">
      {/* Top Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-slate-900 text-base leading-snug tracking-tight line-clamp-2">
            {task.title}
          </h3>
          <PriorityBadge priority={task.priority} />
        </div>

        {task.description && (
          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
        {/* Due Date & Overdue Tag */}
        <div className="flex items-center justify-between text-xs">
          {formattedDueDate ? (
            <div
              className={`flex items-center gap-1.5 font-medium ${
                isOverdue ? "text-rose-600 font-semibold" : "text-slate-400"
              }`}
            >
              {isOverdue ? (
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              ) : (
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{isOverdue ? `Overdue: ${formattedDueDate}` : `Due ${formattedDueDate}`}</span>
            </div>
          ) : (
            <div className="text-slate-300 text-[11px] italic">No due date</div>
          )}

          <StatusBadge status={task.status} />
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Quick status toggle */}
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className="text-xs font-semibold rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value={TASK_STATUSES.PENDING}>Pending</option>
            <option value={TASK_STATUSES.IN_PROGRESS}>In Progress</option>
            <option value={TASK_STATUSES.COMPLETED}>Completed</option>
          </select>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(task)}
              title="Edit Task"
              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task)}
              title="Delete Task"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
