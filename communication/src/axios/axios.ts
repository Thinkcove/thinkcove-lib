import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { SmsResponse } from "../types/smsTypes";
import { AXIOS_MESSAGE } from "../constants/constant";

type ConfigWithMethod = Omit<AxiosRequestConfig, "method"> & {
  method?: Method;
};

/**
 * Executes an HTTP request with full Axios options. Defaults to GET.
 */
export const axiosCall = async (config: ConfigWithMethod = {}): Promise<SmsResponse> => {
  const method = config.method ?? "GET"; // method is now type-safe

  try {
    const response: AxiosResponse = await axios.request({
      ...config,
      method
    });

    return {
      success: true,
      message: AXIOS_MESSAGE.SUCCESS,
      response
    };
  } catch (error: any) {
    return {
      success: false,
      message: AXIOS_MESSAGE.FAILURE,
      error
    };
  }
};
