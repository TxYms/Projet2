import { HttpErrorResponse } from '@angular/common/http';

/**
 * Builds a readable message from a back-end error (ErrorDetails "message", validation "detail"...).
 */
export function getErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Unable to reach the server';
  }
  return error.error?.message ?? error.error?.detail ?? `Error ${error.status}`;
}
