'use client';

import { Icons } from '@/components/icons';

export const settingList = [
  {
    name: 'Account',
    description: 'Create and configure emotion expressions',
    icon: Icons.user,
    path: '/settings/account',
  },
  {
    name: 'Models',
    description: 'Global shared models',
    icon: Icons.brain,
    path: '/settings/models',
  },
  {
    name: 'API Keys',
    description: 'Configure how robot speaks',
    icon: Icons.key,
    path: '/settings/api-keys',
  },
];
