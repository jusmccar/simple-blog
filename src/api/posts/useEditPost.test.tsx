import { ReactElement, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { PostType } from '@app/api/models/Post';
import * as apis from '@app/api/posts/apis';
import useEditPost from '@app/api/posts/useEditPost';
import queryClientModule from '@app/api/queryClient';
import getTestPost from '@app/testFactories/PostFactory';

describe('useEditPost', () => {
  const mockedPost: PostType = getTestPost();
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: ReactNode }): ReactElement => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Calls patchPost when mutate is called', async () => {
    const mockedPostData = new FormData();
    mockedPostData.append('title', 'title');
    mockedPostData.append('description', 'description');

    const patchPostSpy = vi.spyOn(apis, 'patchPost').mockResolvedValue(mockedPost);

    const { result } = renderHook(() => useEditPost(), { wrapper });
    result.current.mutate({ id: 1, formData: mockedPostData });

    await waitFor(() => {
      expect(patchPostSpy).toHaveBeenCalledTimes(1);
      expect(patchPostSpy).toHaveBeenCalledWith({ id: 1, formData: mockedPostData });
    });
  });

  it('Invalidate queries on success', async () => {
    const mockedPostData = new FormData();
    mockedPostData.append('title', 'title');
    mockedPostData.append('description', 'description');

    const patchPostSpy = vi.spyOn(apis, 'patchPost').mockResolvedValue(mockedPost);
    const invalidateQueriesSpy = vi.spyOn(queryClientModule, 'invalidateQueries');

    const { result } = renderHook(() => useEditPost(), { wrapper });
    result.current.mutate({ id: 1, formData: mockedPostData });

    await waitFor(() => {
      expect(patchPostSpy).toHaveBeenCalledTimes(1);
      expect(invalidateQueriesSpy).toHaveBeenCalledTimes(2);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['POSTS'] });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['POSTS', 1] });
    });
  });
});
