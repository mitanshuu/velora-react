import {
  LIST_CATEGORY,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  VIEW_CATEGORY,
  FILE_UPLOAD,
  CATEGORY_DROPDOWN,
} from "./apiRoutes";
import apiService from "./apiService";
import { checkStatusCodeSuccess } from "../utils/common";

export const listOfCategories = async (payload) => {
  try {
    const response = await apiService.post(LIST_CATEGORY, payload);
    const { statusCode, message, data } = response.data;
    if (checkStatusCodeSuccess(statusCode)) {
      return { success: true, message, data };
    }
    return { success: false, message: message || "Failed to fetch categories" };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message,
    };
  }
};

export const addCategory = async (payload) => {
  try {
    const response = await apiService.post(ADD_CATEGORY, payload);
    const { statusCode, message, data } = response.data;
    if (checkStatusCodeSuccess(statusCode)) {
      return { success: true, message, data };
    }
    return { success: false, message: message || "Failed to add category" };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message,
    };
  }
};

export const updateCategory = async (id, payload) => {
  try {
    const response = await apiService.put(`${UPDATE_CATEGORY}${id}`, payload);
    const { statusCode, message, data } = response.data;
    if (checkStatusCodeSuccess(statusCode)) {
      return { success: true, message, data };
    }
    return { success: false, message: message || "Failed to update category" };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message,
    };
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await apiService.delete(`${DELETE_CATEGORY}${id}`);
    const { statusCode, message, data } = response.data;
    if (checkStatusCodeSuccess(statusCode)) {
      return { success: true, message, data };
    }
    return { success: false, message: message || "Failed to delete category" };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message,
    };
  }
};

export const viewCategory = async (id) => {
  try {
    const response = await apiService.get(`${VIEW_CATEGORY}${id}`);
    const { statusCode, message, data } = response.data;
    if (checkStatusCodeSuccess(statusCode)) {
      return { success: true, message, data };
    }
    return { success: false, message: message || "Failed to view category" };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message,
    };
  }
};

export const fileUpload = async (payload) => {
  try {
    const response = await apiService.post(FILE_UPLOAD, payload, {
      isMultipart: true,
    });
    const { statusCode, message, data } = response.data;
    if (checkStatusCodeSuccess(statusCode)) {
      return { success: true, message, data };
    }
    return { success: false, message: message || "Failed to upload file" };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message,
    };
  }
};

export const categoryDropdown = async () => {
  try {
    const response = await apiService.get(CATEGORY_DROPDOWN);
    const { statusCode, message, data } = response.data;
    if (checkStatusCodeSuccess(statusCode)) {
      return { success: true, message, data };
    }
    return { success: false, message: message || "Failed to fetch categories" };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message,
    };
  }
};
