import { useToast as useToastContext } from '../context/ToastContext';

// Re-export the hook with additional convenience methods
export const useToast = () => {
  const toast = useToastContext();

  return {
    ...toast,
    // Additional convenience methods
    showSuccess: (message: string, title?: string) => 
      toast.success(message, { title }),
    showError: (message: string, title?: string) => 
      toast.error(message, { title }),
    showWarning: (message: string, title?: string) => 
      toast.warning(message, { title }),
    showInfo: (message: string, title?: string) => 
      toast.info(message, { title }),
  };
};

export default useToast;
