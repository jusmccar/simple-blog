import { useMutation, UseMutationResult } from '@tanstack/react-query';
import queryClient from '@app/api/queryClient';
import { PostType } from '@app/api/models/Post';
import QUERY_KEYS from '@app/api/queryKeys';
import { patchPost, PatchPostType } from '@app/api/posts/apis';

const useEditPost = (): UseMutationResult<PostType, Error, PatchPostType> => {
  return useMutation({
    mutationFn: patchPost,
    onSuccess: async (_, variables): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS, variables.id] });
    },
  });
};

export default useEditPost;
