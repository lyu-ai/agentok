import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  tutorialSidebar: [
    'concepts',
    'getting-started',
    {
      type: 'category',
      label: 'Tutorials',
      items: [
        'tutorials/search-n-write/index',
        'tutorials/human-in-loop/index',
      ],
    },
    // {
    //   type: 'category',
    //   label: 'Legal',
    //   items: ['legal/tos', 'legal/privacy'],
    // },
  ],
};

export default sidebars;