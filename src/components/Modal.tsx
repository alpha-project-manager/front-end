'use client';

import { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
  actions?: ReactNode;
}

const Modal = ({ open, title, onClose, children, actions }: ModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg border border-gray-200 w-[520px] max-w-[90vw]">
        {title && (
          <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
        )}
        <div className="p-5">
          {children}
        </div>
        {actions && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-end gap-2 rounded-b-lg">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;


