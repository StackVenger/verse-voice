'use client';

import { getBlogById } from '@/api/blogs.mjs';
import { getCurrentUser } from '@/api/users.mjs';
import BlogDetailSkeleton from '@/components/Skeletons/BlogDetailSkeleton';
import {
  Avatar,
  Badge,
  Container,
  Flex,
  Group,
  Space,
  Text,
  Title,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { readLocalStorageValue } from '@mantine/hooks';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import BlogPageInner from './BlogPageInner';

const BlogSingle = () => {
  const { id } = useParams();
  const isLoggedIn = readLocalStorageValue({ key: 'isLoggedIn' });

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => getBlogById(id),
    enabled: !!id,
  });

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    enabled: !!isLoggedIn,
  });

  if (isLoading || !blog) {
    return (
      <Container size={1500} className="!mt-[24px]">
        <BlogDetailSkeleton />
      </Container>
    );
  }

  return (
    <Container size={1500} className="!mt-[24px]">
      <Text
        component={Title}
        variant="gradient"
        className="!my-2 !text-[22px] md:!text-[28px]"
      >
        {blog.title}
      </Text>
      <Badge>{blog.category}</Badge>
      <Space h={'sm'} />
      <Flex justify={'space-between'} align={'center'}>
        <Group>
          <Avatar
            radius={'xs'}
            size={'lg'}
            src={blog.createdBy?.avatar}
            alt="author-img"
          />
          <div>
            <Text fw={600} className="!text-base">
              {blog.createdBy?.name}
            </Text>
            <Text fw={400} size="sm" c="dimmed">
              {blog.publishDate
                ? dayjs(blog.publishDate).format('D MMM YYYY')
                : ''}
            </Text>
            <Text fw={400} size="sm" c="dimmed">
              {blog.authorDetails}
            </Text>
          </div>
        </Group>
      </Flex>
      <Space h={'sm'} />
      <BlogPageInner blog={blog} currentUser={currentUser} />
    </Container>
  );
};

export default BlogSingle;
