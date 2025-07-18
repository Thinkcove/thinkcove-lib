/**
 * Helper class to simplify access to request properties in a Hapi.js application.
 *
 * @param request - Hapi Request object; must conform to @hapi/hapi Request type
 *
 * Example usage:
 * const helper = new RequestHelper(request); // request is of type Hapi.Request
 */
export class RequestHelper {
  // Internal property to store the request object (e.g., Hapi Request type)
  private request: any;

  // Constructor receives and stores the request object
  constructor(request: any) {
    this.request = request;
  }

  // Returns a specific parameter from the URL path parameters
  getParam(key: string): any {
    return this.request.params[key];
  }

  // Returns all URL path parameters as an object
  getAllParams(): { [key: string]: any } {
    return this.request.params;
  }

  // Retrieves all headers from the request
  getHeaders(): { [key: string]: any } {
    return this.request.headers;
  }

  // Retrieves a specific header value from the request
  getHeaderParam(key: string): any {
    return this.request.headers[key];
  }

  // Returns the request payload (typically for POST/PUT requests)
  getPayload(): any {
    return this.request.payload;
  }

  // Extracts and returns the raw query string (e.g., "key1=value1&key2=value2")
  getQueryString(): string {
    if (this.request.url && this.request.url.search && this.request.url.search !== "") {
      // Remove the leading "?" from the query string
      return this.request.url.search.substring(1);
    }
    return "";
  }

  // Retrieves a specific query parameter value by key
  getQueryParam(key: string): any {
    return this.request.query[key];
  }

  // Dynamically sets a path parameter value (mutates the request object)
  setParam(key: string, value: any): void {
    this.request.params[key] = value;
  }

  // Retrieves the authenticated user object from the request (if available)
  getUser(): any {
    return this.request.auth?.artifacts?.user;
  }
}
