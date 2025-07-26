import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export class Utils {
  /**
   * Creates a UUID.
   *
   * @return {string} A UUID V4 string.
   */
  static uuid = (): string => uuidv4();

  /**
   * Hashes a plain text string using bcrypt.
   *
   * @param {string} text - The plain text string to hash.
   * @param {string | number} saltOrRounds - A salt string or the number of salt rounds (e.g., 10).
   * @return {Promise<string>} The hashed string.
   */
  static hash = async (text: string, saltOrRounds: string | number): Promise<string> =>
    bcrypt.hash(text, saltOrRounds);

  /**
   * Compares a plain text string with a hashed string.
   *
   * @param {string} text - The plain text string to compare.
   * @param {string} hashedText - The hashed string to compare against.
   * @return {Promise<boolean>} True if the strings match, false otherwise.
   */
  static compare = async (text: string, hashedText: string): Promise<boolean> =>
    bcrypt.compare(text, hashedText);
}
