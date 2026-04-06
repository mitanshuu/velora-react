import {
  LIST_PRODUCT,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  VIEW_PRODUCT,
  DELETE_PRODUCT,
} from "./apiRoutes";
import apiService from "./apiService";
import { checkStatusCodeSuccess } from "../utils/common";

export const listOfProducts = async (payload) => {
  try {
    const response = await apiService.post(LIST_PRODUCT, payload);
    const { statusCode, message, data } = response.data;
    if (checkStatusCodeSuccess(statusCode)) {
      return { success: true, message, data };
    }
    return { success: false, message: message || "Failed to fetch products" };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message,
    };
  }
};

export const addProduct = async (payload) => {
  try {
    const response = await apiService.post(ADD_PRODUCT, payload);
    const { statusCode, message, data } = response.data;
    if (checkStatusCodeSuccess(statusCode)) {
      return { success: true, message, data };
    }
    return { success: false, message: message || "Failed to add product" };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message,
    };
  }
};

export const updateProduct = async (id, payload) => {
  try {
    const response = await apiService.put(`${UPDATE_PRODUCT}${id}`, payload);
    const { statusCode, message, data } = response.data;
    if (checkStatusCodeSuccess(statusCode)) {
      return { success: true, message, data };
    }
    return { success: false, message: message || "Failed to update product" };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message,
    };
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await apiService.delete(`${DELETE_PRODUCT}${id}`);
    const { statusCode, message, data } = response.data;
    if (checkStatusCodeSuccess(statusCode)) {
      return { success: true, message, data };
    }
    return { success: false, message: message || "Failed to delete product" };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message,
    };
  }
};

export const viewProduct = async (id) => {
  try {
    const response = await apiService.get(`${VIEW_PRODUCT}${id}`);
    const { statusCode, message, data } = response.data;
    if (checkStatusCodeSuccess(statusCode)) {
      return { success: true, message, data };
    }
    return { success: false, message: message || "Failed to view product" };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message,
    };
  }
};
