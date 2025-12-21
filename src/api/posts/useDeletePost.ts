import { useMutation, UseMutationResult } from '@tanstack/react-query';
import queryClient from '@app/api/queryClient';
import QUERY_KEYS from '@app/api/queryKeys';
import { deletePost } from '@app/api/posts/apis';

const useDeletePost = (): UseMutationResult<string, Error, number> => {
  return useMutation({
    mutationFn: deletePost,
    onSuccess: (): Promise<void> => {
      return queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
    },
  });
};

export default useDeletePost;
