/**
 * Common Types and Utilities
 */

import { ChangeEvent } from "react";

// Form Input Handler Types
export type InputChangeHandler = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => void;

// Select Option Type
export interface SelectOption {
  label: string;
  value: string;
}

// Generic Field Error Type
export interface FieldErrors {
  [field: string]: string;
}

// Loading State Type
export type LoadingState = boolean;

// Generic ID Type
export type ID = string;

// Date Type (can be string or Date object)
export type DateType = string | Date;

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Sort Types
export type SortOrder = "asc" | "desc";

export interface SortParams {
  field: string;
  order: SortOrder;
}

// Route Params
export interface RouteParams {
  id?: string;
  [key: string]: string | undefined;
}
