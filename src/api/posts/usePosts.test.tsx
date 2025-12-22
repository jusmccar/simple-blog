import axios from 'axios';
import { ReactElement, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { PostType } from '@app/api/models/Post';
import usePosts from '@app/api/posts/usePosts';
import getTestPost from '@app/testFactories/PostFactory';

vi.mock('axios');

describe('usePosts', () => {
  const mockedPosts: PostType[] = [getTestPost()];
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: ReactNode }): ReactElement => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('Returns the posts from API', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockedPosts });

    const { result } = renderHook(() => usePosts(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockedPosts);
  });
});
