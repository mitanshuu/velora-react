import apiService from "./apiService";
import { ORDER_REPORT, USER_REPORT } from "./apiRoutes";
import { checkStatusCodeSuccess } from "../utils/common";

export const getOrderReport = async (payload) => {
  try {
    const response = await apiService.post(ORDER_REPORT, payload);

    const { statusCode, message, data } = response.data;
    if (checkStatusCodeSuccess(statusCode)) {
      return {
        success: true,
        message,
        data,
      };
    }
    return {
      success: false,
      message,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
};

export const getUserReport = async (payload) => {
  try {
    const response = await apiService.post(USER_REPORT, payload);

    const { statusCode, message, data } = response.data;
    if (checkStatusCodeSuccess(statusCode)) {
      return {
        success: true,
        message,
        data,
      };
    }
    return {
      success: false,
      message,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
};
