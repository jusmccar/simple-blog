import axios from 'axios';

import { PostType } from '@app/api/models/Post';
import { fetchPosts } from '@app/api/posts/usePosts';
import { API_URL_POSTS } from '@app/constants';

vi.mock('axios');

describe('usePosts', () => {
  describe('fetchPosts', () => {
    it('Returns the correct data from API', async () => {
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

      vi.mocked(axios.get).mockResolvedValue({ data: mockedPosts });

      const response = await fetchPosts();
      expect(response).toStrictEqual(mockedPosts);
      expect(axios.get).toHaveBeenCalledWith(API_URL_POSTS);
    });
  });
});
