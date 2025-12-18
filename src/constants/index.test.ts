import { COURSE_NAME } from '@app/constants/index';

describe('Constants', () => {
  it('Should return the correct value for COURSE_NAME', () => {
    expect(COURSE_NAME).toBe('Advanced Testing with React, Jest, Vitest, and Playwright');
  });
});
