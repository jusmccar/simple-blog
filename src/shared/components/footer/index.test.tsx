import { render, screen } from '@testing-library/react';

import { COURSE_NAME } from '@app/constants';
import Footer from '@app/shared/components/footer/index';

describe('Footer', () => {
  it('Renders the footer properly', () => {
    render(<Footer />);

    expect(screen.getByText('Simple Blog created for the course')).toBeInTheDocument();
    expect(screen.getByText(COURSE_NAME)).toBeInTheDocument();
  });
});
