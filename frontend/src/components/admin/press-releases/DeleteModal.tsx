"use client";

import { FaTrash, FaTimes } from "react-icons/fa";


interface DeleteModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  onConfirm: () => void;
}


export default function DeleteModal({
  isOpen,
  title,
  onClose,
  onConfirm,
}: DeleteModalProps) {

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between">

          <h2 className="text-xl font-bold text-gray-900">
            Delete Press Release
          </h2>


          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>

        </div>


        {/* Content */}
        <div className="mt-5">

          <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4">

            <FaTrash className="text-red-600" />

            <p className="text-gray-700">
              Are you sure you want to delete
              <span className="font-semibold">
                {" "}
                {title}
              </span>
              ?
            </p>

          </div>

        </div>


        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-lg border px-5 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>


          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
          >
            Delete
          </button>

        </div>


      </div>

    </div>
  );
}