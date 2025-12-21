import { ReactElement, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { PostType } from '@app/api/models/Post';
import * as apis from '@app/api/posts/apis';
import useCreatePost from '@app/api/posts/useCreatePost';
import queryClientModule from '@app/api/queryClient';

describe('useCreatePost', () => {
  const mockedPost: PostType = {
    id: 1,
    title: 'title',
    description: 'description',
    createdAt: '',
    author: {
      avatarUrl: '',
      name: 'Justin',
    },
    image: {},
    publishedDate: '',
  };

  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: ReactNode }): ReactElement => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Calls uploadPost when mutate is called', async () => {
    const mockedPostData = new FormData();
    mockedPostData.append('id', '1');
    mockedPostData.append('title', 'title');
    mockedPostData.append('description', 'description');

    const uploadPostSpy = vi.spyOn(apis, 'default').mockResolvedValue(mockedPost);

    const { result } = renderHook(() => useCreatePost(), { wrapper });
    result.current.mutate(mockedPostData);

    await waitFor(() => {
      expect(uploadPostSpy).toHaveBeenCalledTimes(1);
      expect(uploadPostSpy).toHaveBeenCalledWith(mockedPostData);
    });
  });

  it('Invalidate queries on success', async () => {
    const mockedPostData = new FormData();
    mockedPostData.append('id', '1');
    mockedPostData.append('title', 'title');
    mockedPostData.append('description', 'description');

    const uploadPostSpy = vi.spyOn(apis, 'default').mockResolvedValue(mockedPost);
    const invalidateQueriesSpy = vi.spyOn(queryClientModule, 'invalidateQueries');

    const { result } = renderHook(() => useCreatePost(), { wrapper });
    result.current.mutate(mockedPostData);

    await waitFor(() => {
      expect(uploadPostSpy).toHaveBeenCalledTimes(1);
      expect(invalidateQueriesSpy).toHaveBeenCalledTimes(1);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['POSTS'] });
    });
  });
});
