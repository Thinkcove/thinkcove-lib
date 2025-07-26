import { Document, FilterQuery, Model, PopulateOptions, Query } from "mongoose";
import { PAGINATION } from "./paginationConstants";

/**
 * Options to configure the MongoPagination function.
 */
export interface PaginateOptions<T extends Document> {
  /** Mongoose model to query */
  model: Model<T>;

  /** MongoDB filter query (optional) */
  conditions?: FilterQuery<T>;

  /** Page number (1-based, optional, default = 1) */
  page?: number;

  /** Number of documents per page (optional, default = 10) */
  pageSize?: number;

  /** Sort order for the results (optional, default = { createdAt: -1 }) */
  sort?: Record<string, 1 | -1>;

  /** Fields to include or exclude (projection) */
  select?: string | Record<string, 0 | 1>;

  /** Populate options to join referenced documents */
  populate?: PopulateOptions | PopulateOptions[];
}

/**
 * Result returned by MongoPagination.
 */
export interface PaginateResult<T extends Document> {
  /** Current page number */
  page: number;

  /** Number of items per page */
  pageSize: number;

  /** Total number of matching documents */
  totalData: number;

  /** List of documents for the current page */
  data: T[];
}

/**
 * Calculates pagination parameters such as current page, page size, and number of documents to skip.
 *
 * @param {number} page - Requested page number
 * @param {number} pageSize - Requested number of items per page
 * @returns Pagination metadata
 */
function calculatePagination(page = PAGINATION.PAGE, pageSize = PAGINATION.PAGE_SIZE) {
  const currentPage = Math.max(page, 1);
  const itemsPerPage = Math.max(pageSize, 1);
  const skipItems = (currentPage - 1) * itemsPerPage;

  return { currentPage, itemsPerPage, skipItems };
}

/**
 * Constructs a Mongoose query with pagination, sorting, optional projection, and population.
 *
 * @template T - Mongoose document type
 * @param model - Mongoose model to query
 * @param filter - MongoDB filter conditions
 * @param sortFields - Sorting fields
 * @param skip - Number of documents to skip
 * @param limit - Maximum number of documents to return
 * @param projection - Fields to include or exclude
 * @param population - Population options for referenced documents
 * @returns A configured Mongoose Query
 */
function buildQuery<T extends Document>(
  model: Model<T>,
  filter: FilterQuery<T>,
  sortFields: Record<string, 1 | -1>,
  skip: number,
  limit: number,
  projection?: string | Record<string, 0 | 1>,
  population?: PopulateOptions | PopulateOptions[]
): Query<T[], T> {
  const query = model.find(filter).sort(sortFields).skip(skip).limit(limit);
  const queryWithProjection = projection ? query.select(projection) : query;
  const queryWithPopulation = population
    ? queryWithProjection.populate(population)
    : queryWithProjection;

  return queryWithPopulation;
}

/**
 * MongoPagination — A reusable utility function for paginating Mongoose queries.
 *
 * Supports filtering, sorting, field selection, and population of referenced documents.
 *
 * @template T - Mongoose document type
 * @param {PaginateOptions<T>} options - Pagination configuration
 * @returns {Promise<PaginateResult<T>>} Paginated result including metadata and documents
 *
 * @example
 * ```ts
 * const result = await MongoPagination({
 *   model: UserModel,
 *   conditions: { role: 'admin' },
 *   page: 2,
 *   pageSize: 20,
 *   sort: { name: 1 },
 *   select: 'name email role',
 *   populate: { path: 'profile', select: 'avatar bio' },
 * });
 * ```
 */
export async function MongoPagination<T extends Document>({
  model,
  conditions = {},
  page,
  pageSize,
  sort = { createdAt: -1 },
  select,
  populate
}: PaginateOptions<T>): Promise<PaginateResult<T>> {
  const { currentPage, itemsPerPage, skipItems } = calculatePagination(page, pageSize);

  const query = buildQuery(model, conditions, sort, skipItems, itemsPerPage, select, populate);

  const totalDocumentCount = await model.countDocuments(conditions);
  const paginatedDocuments = await query.exec();

  return {
    page: currentPage,
    pageSize: itemsPerPage,
    totalData: totalDocumentCount,
    data: paginatedDocuments
  };
}
