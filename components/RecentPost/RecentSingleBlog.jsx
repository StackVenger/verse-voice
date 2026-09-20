import { memo } from 'react';
import FavoriteButton from '@/components/FavoriteButton';
import { stripHtml } from '@/utils/stripHtml';
import { OptimizedImage, OptimizedAvatar } from '@/components/ui';
import {
  Badge,
  Button,
  Flex,
  Group,
  Space,
  Text,
} from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import dayjs from 'dayjs';
import Link from 'next/link';

const RecentSingleBlog = memo(({ blog }) => {
  const {
    _id,
    blogPicUrl,
    title,
    content,
    category,
    createdBy,
    publishDate,
    timeRead,
  } = blog;

  return (
    <Flex
      className="!gap-3"
      direction={{ base: 'column', sm: 'row' }}
    >
      {/* Full width while the card is stacked, capped once it becomes a row.
          The breakpoint is Tailwind's `md` (768px) on purpose: that is where
          Mantine's `sm` sits, which is what flips the Flex above to a row.
          Using Tailwind's `sm` (640px) would re-cap the image while the card
          was still stacked. */}
      <div
        className="relative w-full shrink-0 overflow-hidden md:max-w-[280px]"
        style={{
          height: '180px',
          borderRadius: 'var(--mantine-radius-md)',
        }}
      >
        <OptimizedImage
          src={blogPicUrl}
          alt={title}
          fill
          sizes="(max-width: 767px) 100vw, 280px"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="!flex-1">
        <Group justify="space-between">
          <Badge>{category}</Badge>
          <Group className="!gap-2">
            <FavoriteButton blogId={_id} size={14} />
            <IconClock size={14} />
            <Text fw={400} size="xs">
              {timeRead || '3 mins read'}
            </Text>
          </Group>
        </Group>
        <Space h={'xs'} />
        <Text fw={500} className="!text-[18px]" lineClamp={2}>
          {title}
        </Text>
        <Text fw={400} className="!mt-2 !text-xs" c="dimmed" lineClamp={3}>
          {stripHtml(content)}
        </Text>
        <Group justify="space-between" mt="xs" mb="xs">
          <Group className="!items-center">
            <OptimizedAvatar src={createdBy?.avatar} name={createdBy?.name} preset="sm" />
            <div>
              <Text className="!text-sm !font-medium">{createdBy?.name}</Text>
              <Text fw={400} size="xs" c="dimmed">
                {publishDate ? dayjs(publishDate).format('D MMM YYYY') : ''}
              </Text>
            </div>
          </Group>
          <Button
            variant="subtle"
            color="cyan"
            component={Link}
            href={`/blogs/${_id}`}
            size="compact-sm"
          >
            Read More
          </Button>
        </Group>
      </div>
    </Flex>
  );
});

RecentSingleBlog.displayName = 'RecentSingleBlog';

export default RecentSingleBlog;
