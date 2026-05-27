import { createContext, useContext } from "react";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/ui/Toast";

const ToastContext = createContext();

/**
 * ToastProvider — wraps the app and provides global toast functionality.
 * Uses the useToast hook internally and renders the ToastContainer.
 * Components call useToastContext() to fire toasts from anywhere.
 */
export const ToastProvider = ({ children }) => {
  const { toasts, showToast, removeToast } = useToast();

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToastContext must be used within a ToastProvider");
  return ctx;
};
