import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import { AlertTriangle, Trash2 } from "lucide-react";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Task",
  message = "Are you sure you want to delete this task? This action cannot be undone.",
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="text-center sm:text-left sm:flex sm:items-start sm:gap-4">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 sm:mx-0">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:text-left">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          loading={loading}
          icon={Trash2}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}
