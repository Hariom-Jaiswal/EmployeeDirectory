export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  date_of_joining: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export type SearchMode = 'both' | 'name' | 'department';

export interface EmployeeQueryParams {
  search?: string;
  mode?: SearchMode;
  limit?: number;
  offset?: number;
}

export type APIStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

