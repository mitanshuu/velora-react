import apiService from "./apiService";
import {
  DASHBOARD_STATISTICS,
  DASHBOARD_PIE_CHART,
  DASHBOARD_LIST_OF_ORDER,
  DASHBOARD_HIGHEST_PURCHASE_ORDER,
} from "./apiRoutes";
import { checkStatusCodeSuccess } from "../utils/common";

export const getStatistics = async () => {
  try {
    const response = await apiService.get(DASHBOARD_STATISTICS);

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

export const getPieChart = async (payload) => {
  try {
    const response = await apiService.post(DASHBOARD_PIE_CHART, payload);

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

export const getListOfOrder = async (payload) => {
  try {
    const response = await apiService.post(DASHBOARD_LIST_OF_ORDER, payload);

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

export const getHighestPurchaseOrder = async () => {
  try {
    const response = await apiService.get(DASHBOARD_HIGHEST_PURCHASE_ORDER);

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
