import { MemoryRouter } from 'react-router-dom';
import { Mock } from 'vitest';
import { faker } from '@faker-js/faker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import ListPosts from '@app/admin/components/posts/listPosts';
import { PostType } from '@app/api/models/Post';
import usePosts from '@app/api/posts/usePosts';
import getTestPost from '@app/testFactories/PostFactory';

vi.mock('@app/api/posts/usePosts');

describe('<ListPosts />', () => {
  const queryClient = new QueryClient();

  it('Renders loading if the posts have not been loaded yet', () => {
    (usePosts as Mock).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    });

    render(<ListPosts />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('Renders a table with a list of posts', () => {
    const mockedPosts: PostType[] = Array.from(
      { length: faker.number.int({ min: 1, max: 20 }) },
      () => getTestPost(),
    );

    (usePosts as Mock).mockReturnValue({
      data: mockedPosts,
      isLoading: false,
      error: null,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ListPosts />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
});
