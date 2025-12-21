import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { PostType } from '@app/api/models/Post';
import { API_URL_POSTS } from '@app/constants';
import queryClient from '@app/api/queryClient';
import QUERY_KEYS from '@app/api/queryKeys';
import uploadPost from '@app/api/posts/apis';

const useCreatePost = () => {
  return useMutation({
    mutationFn: uploadPost,
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
    },
  });
};

export default useCreatePost;
