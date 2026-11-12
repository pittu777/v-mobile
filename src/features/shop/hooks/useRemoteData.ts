import { useEffect, useState } from 'react';

export function useRemoteData<T>(load: () => Promise<T>) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    attempt: number;
    data: T | null;
    error: string | null;
  }>({ attempt: -1, data: null, error: null });

  useEffect(() => {
    let active = true;

    load()
      .then((result) => {
        if (active) setResult({ attempt, data: result, error: null });
      })
      .catch((reason: unknown) => {
        if (active) {
          setResult({
            attempt,
            data: null,
            error: reason instanceof Error ? reason.message : 'Could not load data.',
          });
        }
      });

    return () => {
      active = false;
    };
  }, [load, attempt]);

  const isCurrentAttempt = result.attempt === attempt;

  return {
    data: result.data,
    loading: !isCurrentAttempt,
    error: isCurrentAttempt ? result.error : null,
    retry: () => setAttempt((value) => value + 1),
  };
}
