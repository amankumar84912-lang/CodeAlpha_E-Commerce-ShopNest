import { useState, useCallback } from "react";

let _id = 0;

/**
 * Core toast management hook.
 * Consumed by ToastContext — not used directly by components.
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 3500) => {
    const id = ++_id;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
};
