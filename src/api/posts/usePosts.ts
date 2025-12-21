import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from 'axios';
import { PostType } from '@app/api/models/Post';
import { API_URL_POSTS } from '@app/constants';
import QUERY_KEYS from '@app/api/queryKeys';

const fetchPosts = async (): Promise<PostType[]> => {
  const res = await axios.get<PostType[]>(API_URL_POSTS);

  return res.data;
};

const usePosts = (): UseQueryResult<PostType[]> => {
  return useQuery<PostType[], Error>({
    queryKey: [QUERY_KEYS.POSTS],
    queryFn: fetchPosts,
  });
};

export default usePosts;
