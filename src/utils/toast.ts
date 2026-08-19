import { toast, ToastOptions } from 'react-hot-toast';

const defaultOptions: ToastOptions = {
  position: 'top-right',
  duration: 4000,
};

export const notify = {
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      ...defaultOptions,
      icon: '✅',
      ...options,
    });
  },

  error: (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      ...defaultOptions,
      icon: '❌',
      ...options,
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    return toast(message, {
      ...defaultOptions,
      icon: '⚠️',
      style: {
        borderLeft: '4px solid #f59e0b',
      },
      ...options,
    });
  },

  info: (message: string, options?: ToastOptions) => {
    return toast(message, {
      ...defaultOptions,
      icon: 'ℹ️',
      style: {
        borderLeft: '4px solid #3b82f6',
      },
      ...options,
    });
  },

  loading: (message: string = 'Processing request...', options?: ToastOptions) => {
    return toast.loading(message, {
      ...defaultOptions,
      ...options,
    });
  },

  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: ToastOptions,
  ) => {
    return toast.promise(promise, messages, {
      ...defaultOptions,
      ...options,
    });
  },
};
