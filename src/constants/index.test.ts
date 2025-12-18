import { COURSE_NAME, divide } from '@app/constants/index';

describe('Constants', () => {
  it('Should return the correct value for COURSE_NAME', () => {
    expect(COURSE_NAME).toBe('Advanced Testing with React, Jest, Vitest, and Playwright');
  });
});

describe('Divide', () => {
  it('Should return the value of a divided by b', () => {
    expect(divide(4, 2)).toBe(2);
  });

  it('Should throw when attempting to divide by zero', () => {
    expect(() => divide(4, 0)).toThrow('Division by zero is not possible');
  });
});
