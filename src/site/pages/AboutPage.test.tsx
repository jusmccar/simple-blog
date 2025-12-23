import { render, screen } from '@testing-library/react';

import { COURSE_NAME } from '@app/constants';
import AboutPage from '@app/site/pages/AboutPage';

describe('AboutPage', () => {
  it('Shows the about info correctly', () => {
    render(<AboutPage />);

    const headings = screen.getAllByRole('heading');

    expect(headings[0]).toHaveTextContent('About This Project');
    expect(headings[1]).toHaveTextContent(COURSE_NAME);

    expect(
      screen.getByText(
        'The goal of this course is to help developers master testing strategies in modern React applications using industry-standard tools and techniques. Throughout the course, we cover:',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'This codebase serves as a hands-on reference, demonstrating real-world examples and testing scenarios that are explained in detail throughout the course.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Feel free to explore, clone, and modify the code as you follow along!'),
    ).toBeInTheDocument();
  });
});
