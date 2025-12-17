import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

export function useQueryStateByKey<T>(
  key: string | string[],
  initialData?: T,
) {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => [...key], [key]);

  const query = useQuery<T>({
    queryKey,
    queryFn: () => {
      throw new Error('queryFn not needed for client-side state');
    },
    initialData,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { data } = query;

  const setValue = useCallback(
    (updater: T | ((prev: T | undefined) => T)) => {
      queryClient.setQueryData<T>(queryKey, updater);
    },
    [queryClient, queryKey],
  );

  const remove = useCallback(() => {
    queryClient.removeQueries({ queryKey });
  }, [queryClient, queryKey]);

  return {
    value: data,
    setValue,
    remove,
    isLoading: query.isLoading,
    queryKey,
  };
}
