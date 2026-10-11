import type { Employee, PaginatedResponse, EmployeeQueryParams } from './types';

//Added Fallback 
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, '') ||
  'http://localhost:8000';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function fetchEmployees(
  params: EmployeeQueryParams = {},
  signal?: AbortSignal
): Promise<PaginatedResponse<Employee>> {
  const query = new URLSearchParams();

  if (params.search && params.search.trim().length > 0) {
    query.set('search', params.search.trim());
  }

  if (params.mode) {
    query.set('mode', params.mode);
  }

  if (params.limit !== undefined) {
    query.set('limit', params.limit.toString());
  }

  if (params.offset !== undefined) {
    query.set('offset', params.offset.toString());
  }

  const endpoint = `${API_BASE_URL}/employees?${query.toString()}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal,
    });

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage =
            typeof errorData.detail === 'string'
              ? errorData.detail
              : JSON.stringify(errorData.detail);
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
      }
      throw new ApiError(errorMessage, response.status);
    }

    const data: PaginatedResponse<Employee> = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      'Unable to connect to the backend server. Please verify the service is running.',
      0
    );
  }
}

