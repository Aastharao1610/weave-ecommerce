"use client";
import { Dialog } from "@headlessui/react";
import { Fragment } from "react";

const DeleteConfirmationModal = ({
  title,
  message,
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} as={Fragment}>
      <div className="fixed inset-0 bg-tranparent backdrop-blur-xs bg-opacity-25 flex justify-center items-center z-50">
        <Dialog.Panel className="bg-white rounded-lg p-6 shadow-md max-w-sm w-full">
          <Dialog.Title className="text-lg font-semibold text-gray-800">
            Confirm Deletion
          </Dialog.Title>

          <Dialog.Description className="mt-2 text-gray-600">
            {title || "Are you sure you want to delete this item?"}
          </Dialog.Description>
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
