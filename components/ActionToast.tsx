import React, { useState, useEffect } from 'react';

interface ToastState {
  key: number;
  message: string;
  actionLabel: string;
  onAction: () => void;
}

interface ActionToastProps {
  toast: ToastState | null;
}

const ActionToast: React.FC<ActionToastProps> = ({ toast }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentToast, setCurrentToast] = useState<ToastState | null>(toast);

  useEffect(() => {
    if (toast) {
      setCurrentToast(toast);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [toast]);
  
  if (!currentToast) return null;

  return (
    <div className={`fixed bottom-[calc(4.5rem+4rem)] left-1/2 -translate-x-1/2 w-[90vw] max-w-md z-50 transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="bg-neutral-800 rounded-full shadow-lg p-2 flex items-center justify-between text-sm">
        <span className="text-neutral-200 pl-3">{currentToast.message}</span>
        <button
          onClick={currentToast.onAction}
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-blue-500 transition-colors"
        >
          {currentToast.actionLabel}
        </button>
      </div>
    </div>
  );
};

export default ActionToast;