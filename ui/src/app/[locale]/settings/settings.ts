'use client';
import {
  RiKeyFill,
  RiBrainFill,
  RiBrainLine,
  RiKeyLine,
  RiSettings3Fill,
  RiSettings3Line,
} from 'react-icons/ri';

export const settingList = [
  {
    name: 'Account',
    description: 'Create and configure emotion expressions',
    icon: RiSettings3Line,
    activeIcon: RiSettings3Fill,
    path: '/settings/account',
  },
  {
    name: 'Models',
    description: 'Global shared models',
    icon: RiBrainLine,
    activeIcon: RiBrainFill,
    path: '/settings/models',
  },
  {
    name: 'API Keys',
    description: 'Configure how robot speaks',
    icon: RiKeyLine,
    activeIcon: RiKeyFill,
    path: '/settings/api-keys',
  },
];
