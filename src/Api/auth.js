import apiService from "./apiService";
import { LOGIN } from "./apiRoutes";
import { checkStatusCodeSuccess } from "../utils/common";

export const login = async (payload) => {
  try {
    const response = await apiService.post(LOGIN, payload);

    const { statusCode, message, data } = response.data;
    const token = data?.token;

    if (checkStatusCodeSuccess(statusCode)) {
      if (token) {
        sessionStorage.setItem("token", token);

        return {
          success: true,
          message,
          data,
        };
      }
    }

    return {
      success: false,
      message,
    };
  } catch (error) {
    const message = error?.response?.data?.message || error?.message;
    return {
      success: false,
      message,
    };
  }
};
