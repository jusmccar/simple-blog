export const API_URL = 'http://localhost:3001';

export const API_URL_POSTS = 'http://localhost:3001/posts/';

export const COURSE_NAME = 'Advanced Testing with React, Jest, Vitest, and Playwright';

export const divide = (a: number, b: number): number => {
  if (b === 0) {
    throw new Error('Division by zero is not possible');
  }

  return a / b;
};
