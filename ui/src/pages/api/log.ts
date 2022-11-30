import useSWR, { MutatorOptions } from 'swr';
import { fetcher } from '../../libs';

const API_URL = '/api/log';

export const useLog = ({
  startByte,
  byteCount,
}: {
  startByte: number;
  byteCount: number;
}) => {
  const { data, error, mutate } = useSWR<string, Error>(
    () => `${API_URL}?start=${startByte}&count=${byteCount}`,
    (url) =>
      fetcher(url, {
        headers: {
          Accept: 'text/plain',
        },
      }),
  );

  return {
    data,
    isError: error,
    isLoading: !error && !data,
    mutate: (opts?: MutatorOptions) =>
      mutate(
        fetcher(API_URL, {
          method: 'DELETE',
          headers: { Accept: 'text/plain' },
        }),
        opts,
      ),
  };
};

export const useLogSize = () => {
  const { data, error } = useSWR<string, Error>(`${API_URL}/size`, (url) =>
    fetcher(url, {
      headers: {
        Accept: 'text/plain',
      },
    }),
  );

  return {
    data: data ? Number(data) : undefined,
    isError: error,
    isLoading: !error && !data,
  };
};
