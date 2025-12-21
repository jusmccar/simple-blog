import axios from 'axios';
import { ReactElement, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { PostType } from '@app/api/models/Post';
import usePosts, { fetchPosts } from '@app/api/posts/usePosts';
import { API_URL_POSTS } from '@app/constants';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('axios');

describe('usePosts', () => {
  const mockedPosts: PostType[] = [
    {
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
    },
  ];

  describe('fetchPosts', () => {
    it('Returns the correct data from API', async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockedPosts });

      const response = await fetchPosts();
      expect(response).toStrictEqual(mockedPosts);
      expect(axios.get).toHaveBeenCalledWith(API_URL_POSTS);
    });
  });

  describe('usePosts', () => {
    it('Returns the posts from API', async () => {
      const queryClient = new QueryClient();
      const wrapper = ({ children }: { children: ReactNode }): ReactElement => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );
      vi.mocked(axios.get).mockResolvedValue({ data: mockedPosts });

      const { result } = renderHook(() => usePosts(), { wrapper });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockedPosts);
    });
  });
});
