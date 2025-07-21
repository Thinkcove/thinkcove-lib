import {
  Schema,
  model,
  Model,
  SchemaDefinition,
  SchemaOptions,
  Document,
  SchemaDefinitionType
} from "mongoose";

/**
 * Creates a strongly-typed Mongoose model from schema fields and options.
 *
 * @template TSchema - The shape of the schema fields.
 * @template TDoc - The inferred document type.
 * @template TModelName - The name of the model (string literal).
 *
 * @param modelName - The name of the Mongoose model.
 * @param schemaFields - An object defining schema fields.
 * @param options - Optional schema options (e.g., collection name).
 * @returns A Mongoose model with proper typings.
 *
 * @example
 * ```ts
 * const User = createModel('User', {
 *   name: { type: String, required: true },
 *   email: { type: String, required: true, unique: true },
 *   password: { type: String, required: true },
 * });
 *
 * // Usage
 * const user = await User.create({ name: 'Alice', email: 'alice@example.com', password: 'secure' });
 * ```
 */
export const createModel = <
  TSchema extends SchemaDefinition<SchemaDefinitionType<any>>,
  TDoc = SchemaDefinitionType<TSchema>,
  TModelName extends string = string
>(
  modelName: TModelName,
  schemaFields: TSchema,
  options?: SchemaOptions
): Model<TDoc & Document> => {
  const schema = new Schema(schemaFields, { timestamps: true, ...options });
  return model<TDoc & Document>(modelName, schema);
};
