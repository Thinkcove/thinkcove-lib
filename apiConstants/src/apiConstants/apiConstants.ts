
/**
 * Object map for API methods, fully typed.
 */
export type HapiRouteMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
 
export const API_METHODS: Record<HapiRouteMethod, HapiRouteMethod> = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
  OPTIONS: "OPTIONS"
};

/**
 * Literal type for available auth strategy keys.
 */
export type AuthStrategy = string;

/**
 * Object map for auth strategies.
 */
export const STRATEGY: Record<AuthStrategy, AuthStrategy> = {
  SIMPLE: "simple"
};

/**
 * Base API identifier string.
 */
export const API: string = "api";



/**
 *  All constants above are **named exports**.
 *  To use in your project:
 *
 * import {
 *   API,
 *   API_METHODS,
 *   STRATEGY,
 *   type AuthStrategy
 * } from '@your-scope/api-utils';
 */
