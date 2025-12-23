import React, { ReactElement } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@app/api/queryClient';
import MainLayout from '@app/site/mainLayout';
import BlogPage from '@app/site/pages/BlogPage';
import AdminLayout from '@app/admin/adminLayout';
import PostsPage from '@app/admin/pages/posts/postsPage';
import CreatePostPage from '@app/admin/pages/posts/createPostPage';
import PostDetailsPage from '@app/site/pages/PostDetailsPage';
import AboutPage from '@app/site/pages/AboutPage';
import ContactPage from '@app/site/pages/ContactPage';
import EditPostPage from '@app/admin/pages/posts/editPostPage';
import HomePage from '@app/admin/pages/posts/HomePage';

const App = (): ReactElement => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<BlogPage />} />
          <Route path="/post/:id" element={<PostDetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="home" element={<HomePage />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="post/create" element={<CreatePostPage />} />
          <Route path="post/edit/:id" element={<EditPostPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
