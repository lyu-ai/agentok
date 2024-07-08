'use client';
import {
  RiSettings3Fill,
  RiSettings3Line,
  RiBrainFill,
  RiBrainLine,
  RiFireFill,
  RiFireLine,
} from 'react-icons/ri';

export const settingList = [
  {
    name: 'General',
    description: 'Create and configure emotion expressions',
    icon: RiSettings3Line,
    activeIcon: RiSettings3Fill,
    path: '/settings/general',
  },
  {
    name: 'Models',
    description: 'View and manage robot action records',
    icon: RiBrainLine,
    activeIcon: RiBrainFill,
    path: '/settings/models',
  },
  {
    name: 'Advanced',
    description: 'Advanced settings, including danger zone',
    icon: RiFireLine,
    activeIcon: RiFireFill,
    path: '/settings/advanced',
  },
];
