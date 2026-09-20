'use client';

import { subscribe } from '@/api/newsletter.mjs';
import { useSiteSettings } from '@/hooks/queries';
import {
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Paper,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {
  IconArrowRight,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconMail,
  IconUser,
} from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import Logo from '../Header/Logo';

const Footer = () => {
  const { data: settings } = useSiteSettings();
  const footerRef = useRef(null);

  const categories = settings?.categories?.map((c) => c.name) || [];
  const footerText = settings?.footerText || '';

  const [newsletterName, setNewsletterName] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const { mutate: subscribeMutate, isPending } = useMutation({
    mutationFn: subscribe,
    onSuccess: () => {
      toast.success('Subscribed successfully!');
      setNewsletterName('');
      setNewsletterEmail('');
    },
    onError: () => {},
  });

  const handleSubscribe = () => {
    if (!newsletterName || !newsletterEmail) {
      toast.error('Please fill in all fields');
      return;
    }
    subscribeMutate({ name: newsletterName, email: newsletterEmail });
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { rootMargin: '50px' }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} id="footer" className="glass-footer mt-10">
      <Container size={1500} className="!mt-[32px] !py-3">
        <Paper
          className="px-4 py-6 md:px-8 lg:px-24 lg:py-8"
          radius="lg"
          withBorder
        >
          <Grid gutter={'md'} grow>
            <Grid.Col span={12} md={4}>
              <div className={`fade-on-scroll ${isVisible ? 'visible' : ''}`}>
                <Logo />
                <Space h={'md'} />
                <Text className="!text-sm sm:!text-base !text-text-secondary">{footerText}</Text>
              </div>
            </Grid.Col>

            <Grid.Col span={12} md={4}>
              <div className={`fade-on-scroll ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.1s' }}>
                <Title order={4} className="!mb-4">
                  Categories
                </Title>
                <Flex>
                  <div className="!flex !flex-wrap !gap-2">
                    {categories.map((cat) => (
                      <Button
                        variant="subtle"
                        color="cyan"
                        key={cat}
                        component={Link}
                        href={`/category/${cat.toLowerCase()}`}
                        size="compact-sm"
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </Flex>
              </div>
            </Grid.Col>

            <Grid.Col span={12} md={4}>
              <div className={`fade-on-scroll ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
                <Stack>
                  <Title order={4} className="!mb-1">
                    Newsletter
                  </Title>
                  <Text c="dimmed" size="sm">
                    Sign up to be first to receive the latest stories inspiring
                    us, case studies, and industry news.
                  </Text>
                  <TextInput
                    leftSection={<IconUser stroke={2} size={16} />}
                    placeholder="Your Name"
                    value={newsletterName}
                    onChange={(e) => setNewsletterName(e.target.value)}
                  />
                  <TextInput
                    leftSection={<IconMail stroke={2} size={16} />}
                    placeholder="Your Email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                  />
                  <div>
                    <Button
                      variant="gradient"
                      className="glow-btn"
                      rightSection={<IconArrowRight stroke={2} size={16} />}
                      onClick={handleSubscribe}
                      loading={isPending}
                      size="sm"
                    >
                      Subscribe
                    </Button>
                  </div>
                </Stack>
              </div>
            </Grid.Col>
          </Grid>

          <Divider className="!my-5" />

          <Group className="flex-col md:flex-row" justify="space-between">
            <Text size="sm" c="dimmed" className="text-center md:text-left">
              &copy; 2024 Created by{' '}
              <Text
                component={Link}
                variant="gradient"
                href="https://www.facebook.com/rizwansuvo1"
                className="!text-sm !font-bold"
                span
              >
                Rizwan
              </Text>{' '}
              & &nbsp;
              <Text
                component={Link}
                variant="gradient"
                href="https://www.facebook.com/ekramullah70"
                className="!text-sm !font-bold"
                span
              >
                Ekram
              </Text>
            </Text>
            <Group gap="md" className="flex-col md:flex-row">
              {settings?.socialLinks?.twitter && (
                <a
                  href={settings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Group gap="xs">
                    <IconBrandTwitter stroke={1.5} size={18} />
                    <Text size="sm" c="dimmed">Twitter</Text>
                  </Group>
                </a>
              )}
              {settings?.socialLinks?.linkedin && (
                <a
                  href={settings.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Group gap="xs">
                    <IconBrandLinkedin stroke={1.5} size={18} />
                    <Text size="sm" c="dimmed">LinkedIn</Text>
                  </Group>
                </a>
              )}
              {settings?.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Group gap="xs">
                    <IconBrandInstagram stroke={1.5} size={18} />
                    <Text size="sm" c="dimmed">Instagram</Text>
                  </Group>
                </a>
              )}
            </Group>
          </Group>
        </Paper>
      </Container>
    </footer>
  );
};

export default Footer;
