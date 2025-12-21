import QUERY_KEYS from '@app/api/queryKeys';

describe('queryKeys', () => {
  it('Returns correct query key', () => {
    expect(QUERY_KEYS.POSTS).toBe('POSTS');
  });
});
