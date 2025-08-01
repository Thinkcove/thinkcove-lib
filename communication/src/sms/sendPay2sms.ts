import { generateMessage } from "../generateMessage/templateGenerate";
import { SmsConfigProps, SmsResponse, SmsSendInput } from "../types/smsTypes";
import { axiosCall } from "../axios/axios";
import { AxiosRequestConfig, Method } from "axios";

/**
 * Constructs the SMS gateway URL with query parameters.
 */
export const buildSmsUrl = (
  phoneNumber: string,
  message: string,
  config: SmsConfigProps
): string => {
  const params = new URLSearchParams({
    token: config.communicationToken,
    credit: config.creditType,
    sender: config.senderId,
    number: phoneNumber,
    templateid: config.templateId,
    message
  });

  return `${config.smsUrl}?${params.toString()}`;
};

/**
 * Sends an SMS message using the provided template and templateData.
 *
 * @param input - Contains recipient's phoneNumber, template, templateData.
 * @param smsConfig - SMS gateway configuration.
 * @param axiosOptions - Optional Axios options (method, headers, timeout, etc.).
 */
export const sendPay2sms = async (
  input: SmsSendInput,
  smsConfig: SmsConfigProps,
  axiosOptions: Omit<AxiosRequestConfig, "url"> & { method?: Method } = {}
): Promise<SmsResponse> => {
  const content = generateMessage({ template: input.template }, input.templateData);
  const smsUrl = buildSmsUrl(input.phoneNumber, content, smsConfig);

  const result = await axiosCall({
    url: smsUrl,
    method: axiosOptions.method ?? "GET", // default to GET if not provided
    ...axiosOptions
  });

  return result;
};
