import { ReactElement, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import * as apis from '@app/api/posts/apis';
import useDeletePost from '@app/api/posts/useDeletePost';
import queryClientModule from '@app/api/queryClient';

describe('useDeletePost', () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: ReactNode }): ReactElement => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Calls deletePost when mutate is called', async () => {
    const deletePostSpy = vi.spyOn(apis, 'deletePost');

    const { result } = renderHook(() => useDeletePost(), { wrapper });
    result.current.mutate(1);

    await waitFor(() => {
      expect(deletePostSpy).toHaveBeenCalledTimes(1);
      expect(deletePostSpy).toHaveBeenCalledWith(1);
    });
  });

  it('Invalidate queries on success', async () => {
    const deletePostSpy = vi.spyOn(apis, 'deletePost').mockResolvedValue('success');
    const invalidateQueriesSpy = vi.spyOn(queryClientModule, 'invalidateQueries');

    const { result } = renderHook(() => useDeletePost(), { wrapper });
    result.current.mutate(1);

    await waitFor(() => {
      expect(deletePostSpy).toHaveBeenCalledTimes(1);
      expect(invalidateQueriesSpy).toHaveBeenCalledTimes(1);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['POSTS'] });
    });
  });
});
