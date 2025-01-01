'use client';
import { Icons } from '@/components/icons';

export const settingList = [
  {
    name: 'General',
    description: 'Create and configure emotion expressions',
    icon: Icons.settings,
    path: '/settings/general',
  },
  {
    name: 'Models',
    description: 'View and manage robot action records.',
    icon: Icons.brain,
    path: '/settings/models',
  },
  {
    name: 'Advanced',
    description: 'Advanced settings for your project.',
    icon: Icons.fire,
    path: '/settings/advanced',
  },
];
