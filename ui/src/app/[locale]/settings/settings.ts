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
    name: 'Account',
    description: 'Create and configure emotion expressions',
    icon: RiUserSmileLine,
    activeIcon: RiUserSmileFill,
    path: '/settings/account',
  },
  {
    name: 'Models',
    description: 'Global shared models',
    icon: RiWalkLine,
    activeIcon: RiWalkFill,
    path: '/settings/models',
  },
  {
    name: 'API Keys',
    description: 'Configure how robot speaks',
    icon: RiVoiceprintLine,
    activeIcon: RiVoiceprintFill,
    path: '/settings/api-keys',
  },
];
