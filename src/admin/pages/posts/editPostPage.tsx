import { Col, Row, Typography } from 'antd';
import React, { ReactElement } from 'react';
import CreateOrEditPost from '@app/admin/components/posts/createOrEditPost';
import usePost from '@app/api/posts/usePost';
import { useParams } from 'react-router-dom';

const EditPostPage = (): ReactElement => {
  const { id } = useParams();

  const { data: post, isLoading, error } = usePost(parseInt(id || '-1', 10));

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts.</p>;

  return (
    <Row>
      <Col span={12} offset={6}>
        <Typography.Title>Edit Post</Typography.Title>
        <CreateOrEditPost post={post} />
      </Col>
    </Row>
  );
};

export default EditPostPage;
