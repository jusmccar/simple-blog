import React, { ReactElement } from 'react';
import { Avatar, Card } from 'antd';
import { PostType } from '@app/api/models/Post';
import styled from '@emotion/styled';

const { Meta } = Card;

const StyledCard = styled(Card)`
  width: 80%;
`;

const Post = ({ post }: { post: PostType }): ReactElement => {
  const { image, title } = post;

  return (
    <StyledCard cover={<img alt={title} src={image?.url} />}>
      <Meta avatar={<Avatar src={post.author.avatarUrl} />} title={title} />
    </StyledCard>
  );
};

export default Post;
