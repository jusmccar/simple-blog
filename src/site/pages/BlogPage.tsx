import React, { ReactElement } from 'react';
import { Col, Row, theme } from 'antd';
import usePosts from '@app/api/posts/usePosts';
import Post from '@app/shared/components/post';
import { PostType } from '@app/api/models/Post';
import { Link } from 'react-router-dom';

const BlogPage = (): ReactElement => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts.</p>;

  return (
    <div
      style={{
        background: colorBgContainer,
        padding: 24,
        borderRadius: borderRadiusLG,
      }}
    >
      <Row style={{ minHeight: 500 }}>
        {posts?.map(
          (post: PostType): ReactElement => (
            <Col key={post.id} span={8}>
              <Link to={`post/${post.id}`}>
                <Post post={post} />
              </Link>
            </Col>
          ),
        )}
      </Row>
    </div>
  );
};

export default BlogPage;
