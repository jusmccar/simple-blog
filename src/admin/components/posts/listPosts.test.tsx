import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Mock } from 'vitest';
import { faker } from '@faker-js/faker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ListPosts from '@app/admin/components/posts/listPosts';
import EditPostPage from '@app/admin/pages/posts/editPostPage';
import PostsPage from '@app/admin/pages/posts/postsPage';
import { PostType } from '@app/api/models/Post';
import usePost from '@app/api/posts/usePost';
import usePosts from '@app/api/posts/usePosts';
import getTestPost from '@app/testFactories/PostFactory';

vi.mock('@app/api/posts/usePosts');
vi.mock('@app/api/posts/usePost');

describe('<ListPosts />', () => {
  const queryClient = new QueryClient();

  const setupMockedPosts = (minNumberOfPosts: number = 1, maxNumberOfPosts: number = 20) => {
    const mockedPosts: PostType[] = Array.from(
      { length: faker.number.int({ min: minNumberOfPosts, max: maxNumberOfPosts }) },
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

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/posts']}>
          <Routes>
            <Route path="/admin/posts" element={<PostsPage />} />
            <Route path="/admin/post/edit/:id" element={<EditPostPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    return mockedPosts;
  };

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
    const mockedPosts = setupMockedPosts(1, 10);

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();

    const rows = screen.getAllByRole('row');

    expect(rows.length).toBe(mockedPosts.length + 1);

    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText('Featured Image')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });

    expect(screen.getByText(mockedPosts[0].title)).toBeInTheDocument();
    expect(links[0]).toHaveAttribute('href', `/admin/post/edit/${mockedPosts[0].id}`);
    expect(deleteButtons).toHaveLength(mockedPosts.length);
  });

  it('Renders a table with pagination if the number of posts is more than 10', () => {
    const mockedPosts = setupMockedPosts(11, 20);

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();

    const rows = screen.getAllByRole('row');

    expect(rows.length).toBe(11);
  });

  it('Shows the edit post page when the user clicks on the edit button', async () => {
    const mockedPosts = setupMockedPosts(1, 5);
    const user = userEvent.setup();

    const links = screen.getAllByRole('link');

    expect(links[0]).toHaveAttribute('href', `/admin/post/edit/${mockedPosts[0].id}`);

    await user.click(links[0]);

    expect(screen.getByText('Edit Post')).toBeInTheDocument();
  });

  it('Shows a confirmation box when the user clicks on the delete button', async () => {
    const mockedPosts = setupMockedPosts(1, 5);
    const user = userEvent.setup();

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    const confirmationText = 'Are you sure you want to delete this post?';

    expect(screen.queryByText(confirmationText)).not.toBeInTheDocument();

    await user.click(deleteButtons[0]);

    expect(screen.getByText(confirmationText)).toBeInTheDocument();
  });
});
