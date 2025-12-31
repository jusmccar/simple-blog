import { MemoryRouter } from 'react-router-dom';
import { Mock } from 'vitest';
import { faker } from '@faker-js/faker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CreateOrEditPost from '@app/admin/components/posts/createOrEditPost';
import useCreatePost from '@app/api/posts/useCreatePost';

vi.mock('@app/api/posts/useCreatePost');

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

  const setup = () => {
    (useCreatePost as Mock).mockReturnValue({
      mutateAsync: createPost,
      isPending: false,
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CreateOrEditPost />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  it('Renders an empty form', () => {
    setup();

    expect(screen.getAllByRole('textbox')).toHaveLength(2);
    expect(screen.getByText('Title')).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');

    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('Click to Upload');
    expect(buttons[1]).toHaveTextContent('Submit Post');
  });

  it('Users can create a post', async () => {
    const { container } = setup();
    const user = userEvent.setup();
    const postTitle = faker.lorem.sentences();
    const postDescription = faker.lorem.paragraph();
    const imageName = faker.system.fileName();

    const inputs = screen.getAllByRole('textbox');

    await user.type(inputs[0], postTitle);
    await user.type(inputs[1], postDescription);

    const fileInput = container.querySelector('input[type="file"]');

    expect(fileInput).toBeDefined();

    const file = new File(['Sample File Content'], imageName, { type: 'image/png' });

    await userEvent.upload(fileInput as HTMLElement, file);

    const submitButton = screen.getByRole('button', { name: 'Submit Post' });

    await userEvent.click(submitButton);

    waitFor(() => {
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
});
