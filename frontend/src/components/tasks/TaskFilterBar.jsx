import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { TASK_STATUSES, TASK_PRIORITIES } from "../../utils/constants";

export default function TaskFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
}) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          placeholder="Search tasks by title or description..."
          className="block w-full rounded-xl border border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 pl-10 pr-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="rounded-xl border border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none transition-all"
        >
          <option value="">All Statuses</option>
          <option value={TASK_STATUSES.PENDING}>Pending</option>
          <option value={TASK_STATUSES.IN_PROGRESS}>In Progress</option>
          <option value={TASK_STATUSES.COMPLETED}>Completed</option>
        </select>

        {/* Priority Filter */}
        <select
          value={filters.priority}
          onChange={(e) => onFilterChange("priority", e.target.value)}
          className="rounded-xl border border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none transition-all"
        >
          <option value="">All Priorities</option>
          <option value={TASK_PRIORITIES.LOW}>Low</option>
          <option value={TASK_PRIORITIES.MEDIUM}>Medium</option>
          <option value={TASK_PRIORITIES.HIGH}>High</option>
        </select>

        {/* Due Date Filter */}
        <input
          type="date"
          value={filters.due_date}
          onChange={(e) => onFilterChange("due_date", e.target.value)}
          className="rounded-xl border border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 px-3 py-1.5 text-xs text-slate-700 bg-white focus:outline-none transition-all"
        />

        {/* Reset Filters */}
        <button
          onClick={onResetFilters}
          title="Reset Filters"
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
