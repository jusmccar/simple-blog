import { render, screen } from '@testing-library/react';

import Post from '@app/shared/components/post';
import getTestPost from '@app/testFactories/PostFactory';

describe('Post', () => {
  it('Renders the post title properly', () => {
    const post = getTestPost();
    render(<Post post={post} />);

    expect(screen.getByText(post.title)).toBeInTheDocument();
  });
});
