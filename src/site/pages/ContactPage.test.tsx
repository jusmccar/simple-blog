import { render, screen } from '@testing-library/react';

import ContactPage from '@app/site/pages/ContactPage';

describe('ContactPage', () => {
  it('Shows the email, GitHub, and LinkedIn links correctly', () => {
    render(<ContactPage />);

    expect(screen.getByRole('heading')).toHaveTextContent('Contact');

    expect(screen.getByText('justinmccartney1 [@] yahoo.com')).toBeInTheDocument();
    expect(screen.getByText('github.com/jusmccar')).toBeInTheDocument();
    expect(screen.getByText('linkedin.com/in/justinmccartney/')).toBeInTheDocument();

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute('href', 'mailto:justinmccartney1@yahoo.com');
    expect(links[1]).toHaveAttribute('href', 'https://github.com/jusmccar');
    expect(links[2]).toHaveAttribute('href', 'https://www.linkedin.com/in/justinmccartney/');
  });
});
