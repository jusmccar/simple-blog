export interface PostType {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  image: {
    url?: string;
    originalname?: string;
    mimetype?: string;
    size?: number;
    buffer?: string;
  } | null;
  author: {
    avatarUrl: string;
    name: string;
  };
  publishedDate: string;
  numberOfComments: number;
}
