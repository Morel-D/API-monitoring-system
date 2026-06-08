// Add this to your existing types.ts
// Everything else stays the same

export interface PagedResponse<T> {
  content:          T[];
  totalElements:    number;
  totalPages:       number;
  size:             number;
  number:           number;   // current page, 0-based
  first:            boolean;
  last:             boolean;
  numberOfElements: number;
  empty:            boolean;
}