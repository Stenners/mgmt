import { ReactNode } from 'react';
import { button as buttonStyles } from "@heroui/theme";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className={buttonStyles({
                  color: "default",
                  radius: "full",
                  variant: "light",
                  size: "sm"
                })}
              >
                ✕
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}; 