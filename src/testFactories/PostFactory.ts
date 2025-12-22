import { faker } from '@faker-js/faker';

import { PostType } from '@app/api/models/Post';

const getTestPost = (): PostType => ({
  id: faker.number.int(),
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  createdAt: faker.date.recent().toISOString(),
  author: {
    avatarUrl: faker.image.avatar(),
    name: faker.person.fullName(),
  },
  image: {
    url: faker.image.url(),
  },
  publishedDate: faker.date.past().toISOString(),
  numberOfComments: faker.number.int({ min: 0, max: 100 }),
});

export default getTestPost;
