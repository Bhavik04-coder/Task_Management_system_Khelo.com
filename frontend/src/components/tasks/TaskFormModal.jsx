import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { TASK_STATUSES, TASK_PRIORITIES } from "../../utils/constants";
import { PlusCircle, Save } from "lucide-react";

export default function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  title = "Create New Task",
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: TASK_STATUSES.PENDING,
    priority: TASK_PRIORITIES.MEDIUM,
    due_date: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status || TASK_STATUSES.PENDING,
        priority: initialData.priority || TASK_PRIORITIES.MEDIUM,
        due_date: initialData.due_date || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: TASK_STATUSES.PENDING,
        priority: TASK_PRIORITIES.MEDIUM,
        due_date: "",
      });
    }
    setError("");
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Task title is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date || null,
      };
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description="Fill in task details and assign priority & due dates."
    >
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          name="title"
          required
          placeholder="e.g. Implement OAuth Flow"
          value={formData.title}
          onChange={handleChange}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            rows="3"
            placeholder="Add extra context or requirements..."
            value={formData.description}
            onChange={handleChange}
            className="block w-full rounded-xl border border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="block w-full rounded-xl border border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none transition-all"
            >
              <option value={TASK_STATUSES.PENDING}>Pending</option>
              <option value={TASK_STATUSES.IN_PROGRESS}>In Progress</option>
              <option value={TASK_STATUSES.COMPLETED}>Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="block w-full rounded-xl border border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none transition-all"
            >
              <option value={TASK_PRIORITIES.LOW}>Low</option>
              <option value={TASK_PRIORITIES.MEDIUM}>Medium</option>
              <option value={TASK_PRIORITIES.HIGH}>High</option>
            </select>
          </div>
        </div>

        <Input
          label="Due Date"
          name="due_date"
          type="date"
          value={formData.due_date}
          onChange={handleChange}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={initialData ? Save : PlusCircle}
          >
            {initialData ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
