import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export class Utils {
  /**
   * Creates a UUID.
   *
   * @return {string} A UUID V4 string
   */
  static uuid = (): string => uuidv4();

  /**
   * Generates a random string of specified length.
   *
   * @param {number} length - The length of the random string to generate.
   * @return {string} A random string of the specified length.
   */
  static hash = async (text: string, secret: string): Promise<string> => bcrypt.hash(text, secret);
  /**
   * Compares a plain text string with a hashed string.
   *
   * @param {string} text - The plain text string to compare.
   * @param {string} hashedText - The hashed string to compare against.
   * @return {Promise<boolean>} A promise that resolves to true if the strings match, false otherwise.
   */
  static compare = async (text: string, hashedText: string): Promise<boolean> =>
    bcrypt.compare(text, hashedText);
}
