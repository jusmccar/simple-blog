import axios from 'axios';

import { PostType } from '@app/api/models/Post';
import { API_URL_POSTS } from '@app/constants';

export type PatchPostType = {
  id: number;
  formData: FormData;
};

const uploadPost = async (formData: FormData): Promise<PostType> => {
  const response = await axios.post(API_URL_POSTS, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const patchPost = async ({ id, formData }: PatchPostType): Promise<PostType> => {
  const response = await axios.patch(`${API_URL_POSTS}${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const deletePost = async (id: number): Promise<string> => {
  const res = await axios.delete(`${API_URL_POSTS}${id}`);

  return res.data.message;
};

export default uploadPost;
