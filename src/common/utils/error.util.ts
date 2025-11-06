import consola from 'consola';

export function toError(err: unknown): Error {
  if (err instanceof Error) {
    return err;
  }

  if (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    typeof err.message === 'string'
  ) {
    return new Error(err.message);
  }

  if (typeof err === 'object' && err !== null && !('message' in err)) {
    consola.warn('Unexpected error shape:', err);
  }

  try {
    const message =
      typeof err === 'string' ? err : JSON.stringify(err, null, 2);
    return new Error(message);
  } catch {
    return new Error('Unknown error occurred');
  }
}
