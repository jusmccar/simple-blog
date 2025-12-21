import axios from 'axios';
import { PostType } from '@app/api/models/Post';
import { API_URL_POSTS } from '@app/constants';

const uploadPost = async (formData: FormData): Promise<PostType> => {
  const response = await axios.post(API_URL_POSTS, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export default uploadPost;
