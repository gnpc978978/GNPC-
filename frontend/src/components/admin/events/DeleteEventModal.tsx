"use client";

import { FaExclamationTriangle } from "react-icons/fa";

interface DeleteEventModalProps {
  isOpen: boolean;
  eventTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteEventModal({
  isOpen,
  eventTitle,
  onClose,
  onConfirm,
}: DeleteEventModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <FaExclamationTriangle className="text-3xl text-red-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            Delete Event
          </h2>

          <p className="mt-3 text-gray-600">
            Are you sure you want to delete
          </p>

          <p className="mt-1 font-semibold text-red-600">
            "{eventTitle}"
          </p>

          <p className="mt-4 text-sm text-gray-500">
            This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700"
          >
            Delete Event
          </button>
        </div>
      </div>
    </div>
  );
}