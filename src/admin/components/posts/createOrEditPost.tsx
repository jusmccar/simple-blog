import React, { ReactElement, useState } from 'react';
import { Button, Form, Input, message, Upload, UploadFile } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UploadChangeParam } from 'antd/es/upload/interface';
import { CreatePostPropsType } from '@app/admin/components/posts/types';
import useCreatePost from '@app/api/posts/useCreatePost';
import useEditPost from '@app/api/posts/useEditPost';
import { useNavigate } from 'react-router-dom';

const CreateOrEditPost = ({ post }: CreatePostPropsType): ReactElement => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<UploadFile | null>(null);
  const { mutateAsync: createPost } = useCreatePost();
  const { mutateAsync: editPost } = useEditPost();

  const handleApiCall = async (formData: FormData): Promise<void> => {
    try {
      if (post) {
        await editPost({ id: post.id, formData });
        message.success('Post has been updated successfully!');
      } else {
        await createPost(formData);
        message.success('Post has been created successfully!');
      }
    } catch (error) {
      message.error('Error on creation of the post');
    }
  };
  const handleSubmit = async (values: { title: string }): Promise<void> => {
    if (!post && !imageFile) {
      message.error('Please upload an image.');

      return;
    }

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', description);
    // @ts-ignore
    formData.append('image', imageFile);

    await handleApiCall(formData);
    navigate('/admin/posts/');
  };

  const handleImageUpload = (info: UploadChangeParam): void => {
    setImageFile(info.file);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        label="Title"
        name="title"
        initialValue={post?.title || ''}
        rules={[{ required: true, message: 'Please enter the title' }]}
      >
        <Input placeholder="Enter post title" />
      </Form.Item>

      <Form.Item label="Content" required>
        <CKEditor
          editor={ClassicEditor as unknown as never}
          data={post?.description || ''}
          onChange={(_, editor): void => {
            const data = editor.getData();
            setDescription(data);
          }}
        />
      </Form.Item>

      <Form.Item label="Feature Image">
        <Upload
          beforeUpload={(): boolean => false} // prevents automatic upload
          onChange={handleImageUpload}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit Post
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateOrEditPost;
