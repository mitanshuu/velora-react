import { StatusCodes } from "http-status-codes";
import { showErrorToast, showSuccessToast } from "./toastService";

export const checkStatusCodeSuccess = (status) => {
  if (status === undefined) return false;

  return (
    status === StatusCodes.OK ||
    status === StatusCodes.CREATED ||
    status === StatusCodes.ACCEPTED
  );
};

export const checkStatusCodeUnauthorized = (status) => {
  return status === StatusCodes.UNAUTHORIZED;
};

export function getPlaceholder(label, type = "input") {
  const safeLabel = label ? label.toLowerCase() : "";

  if (type === "select") {
    return `Select ${safeLabel}`;
  }
  return `Enter ${safeLabel}`;
}

export const errorHandler = (error) => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    error ||
    "An error occurred";

  showErrorToast(message);
};

export const handleImageError = (event, fallbackImage) => {
  const target = event.target;
  target.src = fallbackImage;
};

export const commonFileUpload = async (
  file,
  uploadApi,
  fieldName = "files",
  setLoading = () => {},
  onSuccess = () => {},
  onError = () => {},
) => {
  if (!file) return;

  setLoading(true);
  try {
    const formData = new FormData();
    formData.append(fieldName, file);

    const response = await uploadApi(formData);
    if (response.success) {
      showSuccessToast(response.message);
      onSuccess(response.data[0]);
    } else {
      showErrorToast(response.message);
      onError(response.message);
    }
  } catch (error) {
    errorHandler(error);
    onError(error);
  } finally {
    setLoading(false);
  }
};
