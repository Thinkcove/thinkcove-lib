export interface ErrorMessage {
  message: string;
  details?: any;
}

type ErrorMessagesMap = Record<number, ErrorMessage>;

const createErrorMessages = (initialData: { status: number; message: string }[] = []) => {
  const errorMessagesMap: ErrorMessagesMap = {};

  // Initialize map with valid entries
  initialData.forEach(({ status, message }) => {
    if (status && message) {
      errorMessagesMap[status] = { message };
    }
  });

  return {
    /**
     * Retrieves the error message for a given status code.
     *
     * @param {number} status - HTTP status code.
     * @returns {ErrorMessage | undefined} The error message, if found.
     */
    getErrorMessage: (status: number): ErrorMessage | undefined => errorMessagesMap[status],

    /**
     * Adds a new error message for a specific status code, if not already present.
     *
     * @param {number} status - HTTP status code.
     * @param {string} message - Message to store.
     * @param {any} [details] - Optional detailed info.
     */
    addErrorMessage: (status: number, message: string, details?: any): void => {
      if (!errorMessagesMap[status]) {
        errorMessagesMap[status] = { message, ...(details && { details }) };
      }
    }
  };
};

export default createErrorMessages;
