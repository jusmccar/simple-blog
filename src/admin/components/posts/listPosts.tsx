import React, { ReactElement } from 'react';
import usePosts from '@app/api/posts/usePosts';
import { Space, Table } from 'antd';
import { PostType } from '@app/api/models/Post';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import DeleteButton from '@app/admin/components/posts/deleteButton';

const StyledImage = styled.img`
  width: 80px;
  height: 60px;
`;

const ListPosts = (): ReactElement => {
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts.</p>;

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (_: string, __: PostType, index: number): number => index + 1,
    },
    {
      title: 'Featured Image',
      dataIndex: 'image.url',
      key: 'imageUrl',
      render: (_: string, record: PostType): ReactElement => (
        <StyledImage alt={record.title} src={record.image?.url} />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: string, record: PostType): ReactElement => (
        <Space size="middle">
          <Link to={`/admin/post/edit/${record.id}`}>Edit</Link>
          <DeleteButton postId={record.id} />
        </Space>
      ),
    },
  ];

  return <Table dataSource={posts} columns={columns} rowKey="id" />;
};

export default ListPosts;
