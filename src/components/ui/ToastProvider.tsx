import React from 'react';
import { ToastProvider as ToastContextProvider, useToast } from '../../context/ToastContext';
import { ToastContainer } from './Toast';

interface ToastProviderProps {
  children: React.ReactNode;
}

const ToastManager: React.FC = () => {
  const { toasts, removeToast } = useToast();
  return <ToastContainer toasts={toasts} onRemove={removeToast} />;
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <ToastContextProvider>
      {children}
      <ToastManager />
    </ToastContextProvider>
  );
};

export default ToastProvider;
