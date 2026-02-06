import type { ApiResponse } from './types';

export function successResponse<T>(data: T, message: string = 'Success'): ApiResponse<T> {
  return {
    isSuccess: true,
    code: 'SUCCESS',
    message,
    data,
  };
}

export function errorResponse(message: string, code: string = 'ERROR'): ApiResponse<null> {
  return {
    isSuccess: false,
    code,
    message,
    data: null,
  };
}
