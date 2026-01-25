import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { api } from '../api/client';

export function useApiQuery<T = any>(key: string, url: string, options?: UseQueryOptions<T>) {
  return useQuery<T>({
    queryKey: [key],
    queryFn: async () => (await api.get(url)).data,
    ...options,
  });
}

export function useApiMutation<T = any>(url: string, options?: UseMutationOptions<T, unknown, any>) {
  return useMutation<T, unknown, any>({
    mutationFn: async (data) => (await api.post(url, data)).data,
    ...options,
  });
}
