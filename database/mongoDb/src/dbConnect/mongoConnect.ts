import mongoose, { ConnectOptions } from "mongoose";

/**
 * Connection options for MongoDB using Mongoose.
 *
 * This interface requires a `URL` string for the connection URI,
 * and accepts all other Mongoose `ConnectOptions` as optional top-level properties.
 */
export interface ConnectMongoDBProps extends Partial<ConnectOptions> {
  /**
   * The MongoDB connection URI.
   * Example: 'mongodb://localhost:27017/mydatabase'
   */
  URL: string;
}

/**
 * Connects to a MongoDB instance using Mongoose.
 *
 * @param {ConnectMongoDBProps} props - MongoDB connection parameters.
 * @returns {Promise<typeof mongoose>} Resolves with the connected Mongoose instance.
 *
 * @example
 * ```ts
 * // Connect to MongoDB using async/await
 * await connectMongoDB({
 *   URL: 'mongodb://localhost:27017',
 *   dbName: 'myAppDB',
 *   user: 'admin',
 *   pass: 'secret',
 *   authSource: 'admin',
 * });
 * ```
 */
export const connectMongoDB = ({ URL, ...options }: ConnectMongoDBProps) =>
  mongoose.connect(URL, options as ConnectOptions);
