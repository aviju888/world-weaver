'use client';

import { useCallback, useEffect, useState } from 'react';

interface EditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function EditorModal({ isOpen, onClose, title, children }: EditorModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!mounted || !isOpen) return null;

  return isOpen ? (
    <div
      className="fixed left-0 top-0 h-full flex items-start z-50 pointer-events-none"
      style={{ width: '100vw' }}
    >
      <div
        className="relative ml-6 mt-8 pointer-events-auto"
        style={{ minWidth: 400, maxWidth: 480 }}
      >
        <div className="bg-white rounded-xl shadow-2xl p-4 border border-gray-200">
          <div className="bg-gray-800 p-4 rounded-t-xl flex justify-between items-center">
            <h1 className="text-xl font-bold header-logo text-white">{title}</h1>
            <button className="text-white hover:text-gray-300 text-2xl" onClick={onClose}>&times;</button>
          </div>
          <div className="p-4">{children}</div>
          <div className="border-t border-gray-200 p-4 flex justify-end">
            <button
              onClick={onClose}
              className="mr-2 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
} 

/* Tailwind Animations */
// Add to your global CSS if not present:
// @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
// .animate-fade-in { animation: fade-in 0.3s ease; }
// @keyframes modal-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
// .animate-modal-in { animation: modal-in 0.3s cubic-bezier(0.4,0,0.2,1); }