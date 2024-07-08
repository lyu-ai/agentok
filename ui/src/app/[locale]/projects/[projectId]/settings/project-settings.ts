'use client';
import {
  RiUserSmileFill,
  RiUserSmileLine,
  RiVoiceprintFill,
  RiVoiceprintLine,
  RiWalkLine,
  RiWalkFill,
} from 'react-icons/ri';

export const settingList = [
  {
    name: 'General',
    description: 'Create and configure emotion expressions',
    icon: RiUserSmileLine,
    activeIcon: RiUserSmileFill,
    path: '/settings/general',
  },
  {
    name: 'Models',
    description: 'View and manage robot action records',
    icon: RiWalkLine,
    activeIcon: RiWalkFill,
    path: '/settings/models',
  },
  {
    name: 'Advanced',
    description: 'Advanced settings, including danger zone',
    icon: RiVoiceprintLine,
    activeIcon: RiVoiceprintFill,
    path: '/settings/advanced',
  },
];
