import { toast } from "react-toastify";

export const showSuccessToast = (message, time = 3000) => {
  toast.success(message, { autoClose: time });
};

export const showErrorToast = (message, time = 3000) => {
  toast.error(message, { autoClose: time });
};
