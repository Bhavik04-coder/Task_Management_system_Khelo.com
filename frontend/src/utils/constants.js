export const TASK_STATUSES = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed"
};

export const TASK_PRIORITIES = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High"
};

export const STATUS_COLORS = {
  [TASK_STATUSES.PENDING]: {
    bg: "bg-amber-500/10",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500"
  },
  [TASK_STATUSES.IN_PROGRESS]: {
    bg: "bg-blue-500/10",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500"
  },
  [TASK_STATUSES.COMPLETED]: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500"
  }
};

export const PRIORITY_COLORS = {
  [TASK_PRIORITIES.LOW]: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    dot: "bg-slate-400"
  },
  [TASK_PRIORITIES.MEDIUM]: {
    bg: "bg-orange-500/10",
    text: "text-orange-700",
    border: "border-orange-200",
    dot: "bg-orange-500"
  },
  [TASK_PRIORITIES.HIGH]: {
    bg: "bg-rose-500/10",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500"
  }
};
