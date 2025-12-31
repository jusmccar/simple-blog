import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Mock } from 'vitest';
import { faker } from '@faker-js/faker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PostType } from '@app/api/models/Post';
import usePost from '@app/api/posts/usePost';
import usePosts from '@app/api/posts/usePosts';
import BlogPage from '@app/site/pages/BlogPage';
import PostDetailsPage from '@app/site/pages/PostDetailsPage';
import getTestPost from '@app/testFactories/PostFactory';

vi.mock('@app/api/posts/usePosts');
vi.mock('@app/api/posts/usePost');

describe('BlogPage', () => {
  const setup = () => {
    const mockedPosts: PostType[] = Array.from(
      { length: faker.number.int({ min: 1, max: 20 }) },
      () => getTestPost(),
    );

    (usePosts as Mock).mockReturnValue({
      data: mockedPosts,
      isLoading: false,
      error: null,
    });

    (usePost as Mock).mockReturnValue({
      data: mockedPosts[0],
      isLoading: false,
      error: null,
    });

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<BlogPage />} />
            <Route path="/post/:id" element={<PostDetailsPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    return mockedPosts;
  };

  it('Renders posts correctly', () => {
    const mockedPosts = setup();

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(mockedPosts.length);
    expect(links[0]).toHaveAttribute('href', `/post/${mockedPosts[0].id}`);

    expect(screen.getByText(mockedPosts[0].title)).toBeInTheDocument();
  });

  it('Navigates to /post/id page after clicking on the items', async () => {
    const mockedPosts = setup();
    const user = userEvent.setup();

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(mockedPosts.length);

    expect(screen.queryByText(mockedPosts[0].description)).not.toBeInTheDocument();

    await user.click(links[0]);

    expect(screen.getByText(mockedPosts[0].author.name)).toBeInTheDocument();
    expect(screen.getByText(mockedPosts[0].description)).toBeInTheDocument();
  });
});
