'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface EditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  title: string;
  children: React.ReactNode;
}

export default function EditorModal({ isOpen, onClose, onSave, title, children }: EditorModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
        <div className="bg-gray-800 p-4 rounded-t-lg">
          <div className="container flex justify-between items-center">
            <h1 className="text-2xl font-bold header-logo">{title}</h1>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 text-2xl"
            >
              &times;
            </button>
          </div>
        </div>

        <div className="p-4">
          {children}
        </div>

        <div className="border-t border-gray-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const shouldClose = onSave?.(); // this will return true/false
              if (shouldClose) {
                onClose();
              }
            }}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
} 