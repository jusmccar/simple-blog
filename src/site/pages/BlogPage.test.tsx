import { Mock } from 'vitest';
import { faker } from '@faker-js/faker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import { PostType } from '@app/api/models/Post';
import usePosts from '@app/api/posts/usePosts';
import BlogPage from '@app/site/pages/BlogPage';
import getTestPost from '@app/testFactories/PostFactory';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@app/api/posts/usePosts');

describe('BlogPage', () => {
  it('Renders posts correctly', () => {
    const mockedPosts: PostType[] = Array.from(
      { length: faker.number.int({ min: 1, max: 20 }) },
      () => getTestPost(),
    );

    (usePosts as Mock).mockReturnValue({
      data: mockedPosts,
      isLoading: false,
      error: null,
    });

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BlogPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(mockedPosts.length);
    expect(links[0]).toHaveAttribute('href', `/post/${mockedPosts[0].id}`);

    expect(screen.getByText(mockedPosts[0].title)).toBeInTheDocument();
  });
});
