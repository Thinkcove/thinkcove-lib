import { AxiosResponse } from "axios";

export type SmsConfigProps = {
  smsUrl: string;
  senderId: string;
  creditType: string;
  communicationToken: string;
  templateId: string;
};

export type TemplateValue =
  | string
  | number
  | boolean
  | TemplateValue[]
  | { [key: string]: TemplateValue };

export type SmsSendInput = {
  phoneNumber: string;
  template: string;
  templateData: { [key: string]: TemplateValue };
};

export type SmsResponse = {
  success: boolean;
  message: string;
  response?: AxiosResponse;
  error?: any;
};

export type MustacheTemplateProps = {
  template: any;
};
