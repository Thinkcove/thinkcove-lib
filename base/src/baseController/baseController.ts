import * as Boom from "@hapi/boom";
import { StatusCodes } from "http-status-codes";
import createErrorMessages from "../errorController/errorMessage";
import { createLogger } from "../logger/logger";

// Define the type of the errorMessages object
type ErrorMessages = ReturnType<typeof createErrorMessages>;

/**
 * Sends a JSON HTTP response using the provided handler.
 *
 * @param {any} handler - Hapi response toolkit (usually `h`).
 * @param {any} response - The response data to send.
 * @returns {any} Hapi response with JSON and HTTP 200.
 *
 * @example\
 * return sendResponse(h, data);
 */
export const sendResponse = (handler: any, response: any): any =>
  handler.response(response).type("application/json").code(StatusCodes.OK);

/**
 * Sets additional data in a Boom error's payload.
 *
 * @param {Boom.Boom} err - The Boom error object.
 * @param {any} [data] - Optional additional details to include.
 * @returns {Boom.Boom} The modified Boom error with attached details.
 */
const setDataInError = (err: Boom.Boom, data?: any): Boom.Boom => {
  err.output.payload.details = data || err.data;
  return err;
};

/**
 * Creates and augments a Boom error with optional data.
 *
 * @param {(message: string, data?: any) => Boom.Boom} errorHandler - Boom error constructor (e.g., Boom.badRequest).
 * @param {string} message - Error message.
 * @param {any} [data] - Optional additional error details.
 * @returns {Boom.Boom} The customized Boom error.
 */
const sendError = (
  errorHandler: (message: string, data?: any) => Boom.Boom,
  message: string,
  data?: any
): Boom.Boom => {
  const err = errorHandler(message, data);
  return setDataInError(err, data);
};

/**
 * Converts DynamoDB-related exceptions to appropriate Boom errors.
 *
 * @param {any} ex - The DynamoDB exception object.
 * @returns {Boom.Boom} Boom error representing the DB error.
 */
const sendDbError = (ex: any): Boom.Boom => {
  if (ex.code === "ConditionalCheckFailedException") {
    return sendError(Boom.conflict, ex.message, ex.data);
  }
  if (ex.code === "NetworkingError") {
    return Boom.badGateway("Unable to connect to database", ex.message);
  }
  return sendError(Boom.badGateway, ex.message);
};

/**
 * Handles and formats errors returned from external API calls.
 *
 * @param {any} ex - The exception object from the API call.
 * @param {ErrorMessages} errorMessages - ErrorMessages instance for localized/custom error messages.
 * @returns {Boom.Boom} Formatted Boom error.
 */
const sendExternalApiErrors = (ex: any, errorMessages: ErrorMessages): Boom.Boom => {
  const exceptionResponse = ex?.response;

  if (!exceptionResponse) {
    const errorMsg = errorMessages.getErrorMessage(StatusCodes.INTERNAL_SERVER_ERROR);
    const message = errorMsg?.message || StatusCodes.INTERNAL_SERVER_ERROR.toString();
    return sendError(Boom.internal, message, errorMsg);
  }

  const customErrorData = errorMessages.getErrorMessage(exceptionResponse.status);
  const customMessage =
    customErrorData?.message ||
    exceptionResponse.data.message ||
    exceptionResponse.data.description;

  const err = new Boom.Boom(customMessage, {
    statusCode: exceptionResponse.status,
    data: exceptionResponse.data
  });

  return setDataInError(err, exceptionResponse.data);
};

/**
 * Processes and formats any thrown error into a Boom-compatible error.
 *
 * @param {any} ex - The error object/exception.
 * @param {ErrorMessages} [errorMessages] - Optional ErrorMessages instance.
 * @returns {Boom.Boom} Boom-formatted error.
 *
 * @example
 * return replyError(error, createErrorMessages());
 */
export const replyError = (
  ex: any,
  errorMessages: ErrorMessages = createErrorMessages()
): Boom.Boom => {
  createLogger().error(ex);

  errorMessages.addErrorMessage(StatusCodes.INTERNAL_SERVER_ERROR, `${ex}`);

  if (ex?.type === "dynamo") {
    return sendDbError(ex);
  }

  if (ex?.isBoom === true) {
    const customMessage = errorMessages.getErrorMessage(ex.output.statusCode);
    if (customMessage) {
      ex.output.payload.message = customMessage.message;
    }
    return setDataInError(ex, customMessage?.details);
  }

  if (ex?.isJoi) {
    return sendError(Boom.badData, ex, ex.details);
  }

  return sendExternalApiErrors(ex, errorMessages);
};
