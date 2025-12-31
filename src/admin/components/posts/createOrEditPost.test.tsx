import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import CreateOrEditPost from '@app/admin/components/posts/createOrEditPost';

describe('<CreateOrEditPost />', () => {
  const queryClient = new QueryClient();

  const setup = () => {
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

    expect(screen.getAllByRole('textbox')).toHaveLength(1);
    expect(screen.getByText('Title')).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');

    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('Click to Upload');
    expect(buttons[1]).toHaveTextContent('Submit Post');
  });
});
