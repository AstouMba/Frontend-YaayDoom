import { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  const icons = {
    success: 'ri-check-line',
    error: 'ri-error-warning-line',
    info: 'ri-information-line',
    warning: 'ri-alert-line',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={`${colors[type]} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[280px]`}>
        <i className={`${icons[type]} text-xl`}></i>
        <p className="flex-1 font-medium">{message}</p>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded">
          <i className="ri-close-line"></i>
        </button>
      </div>
    </div>
  );
}

// Toast context for global access
let toastCallback: ((message: string, type?: ToastType) => void) | null = null;

export function showToast(message: string, type: ToastType = 'info') {
  if (toastCallback) {
    toastCallback(message, type);
  }
}

export function ToastContainer({ 
  toasts, 
  onRemove 
}: { 
  toasts: Array<{id: number; message: string; type: ToastType}>;
  onRemove: (id: number) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => onRemove(toast.id)} 
        />
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<Array<{id: number; message: string; type: ToastType}>>([]);

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  toastCallback = addToast;

  return { toasts, addToast, removeToast };
}
