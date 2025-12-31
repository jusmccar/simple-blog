import { message } from 'antd';
import { MemoryRouter } from 'react-router-dom';
import { Mock } from 'vitest';
import { faker } from '@faker-js/faker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CreateOrEditPost from '@app/admin/components/posts/createOrEditPost';
import useCreatePost from '@app/api/posts/useCreatePost';
import useEditPost from '@app/api/posts/useEditPost';
import getTestPost from '@app/testFactories/PostFactory';

vi.mock('@app/api/posts/useCreatePost');
vi.mock('@app/api/posts/useEditPost');

vi.mock('@ckeditor/ckeditor5-build-classic', () => ({
  default: {},
}));

vi.mock('@ckeditor/ckeditor5-react', () => {
  return {
    CKEditor: ({ onChange, data = '' }: any) => (
      <textarea
        data-testid="mock-ckeditor"
        defaultValue={data}
        onChange={(e) => {
          onChange({}, { getData: () => e.target.value });
        }}
      />
    ),
  };
});

describe('<CreateOrEditPost />', () => {
  const queryClient = new QueryClient();
  const createPost = vi.fn();
  const editPost = vi.fn();

  const setup = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CreateOrEditPost />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  const fillCreatePostForm = async () => {
    const postTitle = faker.lorem.sentences();
    const postDescription = faker.lorem.paragraph();
    const imageName = faker.system.fileName();

    const { container } = setup();
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('textbox');

    await user.type(inputs[0], postTitle);
    await user.type(inputs[1], postDescription);

    const fileInput = container.querySelector('input[type="file"]');

    expect(fileInput).toBeDefined();

    const file = new File(['Sample File Content'], imageName, { type: 'image/png' });

    await userEvent.upload(fileInput as HTMLElement, file);

    const submitButton = screen.getByRole('button', { name: 'Submit Post' });

    await userEvent.click(submitButton);

    return {
      postTitle,
      postDescription,
      imageName,
    };
  };

  beforeEach(() => {
    (useCreatePost as Mock).mockReturnValue({
      mutateAsync: createPost,
      isPending: false,
    });

    (useEditPost as Mock).mockReturnValue({
      mutateAsync: editPost,
      isPending: false,
    });
  });

  it('Renders an empty form', () => {
    setup();

    expect(screen.getAllByRole('textbox')).toHaveLength(2);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByTestId('mock-ckeditor')).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');

    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('Click to Upload');
    expect(buttons[1]).toHaveTextContent('Submit Post');
  });

  it('Calls the createPost mutation when users fill the form', async () => {
    const { postTitle, postDescription, imageName } = await fillCreatePostForm();

    await waitFor(() => {
      expect(createPost).toHaveBeenCalledTimes(1);

      const formDataArg = createPost.mock.calls[0][0];
      const formDataEntries: Record<string, unknown> = {};

      formDataArg.forEach((value: unknown, key: string) => {
        formDataEntries[key] = value;
      });

      expect(formDataEntries.title).toBe(postTitle);
      expect(formDataEntries.description).toBe(postDescription);
      expect(formDataEntries.image).toBeInstanceOf(File);
      expect((formDataEntries.image as File).name).toBe(imageName);
    });
  });

  it('Users see a message if createPost mutation fails', async () => {
    const errorPost = vi.spyOn(message, 'error');
    (useCreatePost as Mock).mockRejectedValue(new Error('Create post mutation failed'));

    await fillCreatePostForm();

    await waitFor(() => {
      expect(errorPost).toHaveBeenCalledTimes(1);
      expect(errorPost).toHaveBeenCalledWith('Error on creation of the post');
    });
  });

  it('Calls the editPost mutation if a post is passed', async () => {
    const imageName = faker.system.fileName();

    const successPost = vi.spyOn(message, 'success');
    const post = getTestPost();

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CreateOrEditPost post={post} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const user = userEvent.setup();

    const inputs = screen.getAllByRole('textbox');

    await user.type(inputs[0], ' 2');
    await user.type(inputs[1], ' description');

    const fileInput = container.querySelector('input[type="file"]');

    expect(fileInput).toBeDefined();

    const file = new File(['Sample File Content'], imageName, { type: 'image/png' });

    await userEvent.upload(fileInput as HTMLElement, file);

    const submitButton = screen.getByRole('button', { name: 'Submit Post' });

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(editPost).toHaveBeenCalledTimes(1);

      const { id, formData } = editPost.mock.calls[0][0];
      const formDataEntries: Record<string, unknown> = {};

      formData.forEach((value: unknown, key: string) => {
        formDataEntries[key] = value;
      });

      expect(id).toBe(post.id);
      expect(formDataEntries.title).toBe(`${post.title} 2`);
      expect(formDataEntries.description).toBe(`${post.description} description`);
      expect(formDataEntries.image).toBeInstanceOf(File);
      expect((formDataEntries.image as File).name).toBe(imageName);

      expect(successPost).toHaveBeenCalledTimes(1);
      expect(successPost).toHaveBeenCalledWith('Post has been updated successfully!');
    });
  });
});
