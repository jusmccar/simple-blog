import { PostType } from '@app/api/models/Post';

const getTestPost = (): PostType => ({
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
  numberOfComments: 0,
});

export default getTestPost;
