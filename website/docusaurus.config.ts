import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'FlowGen',
  tagline: 'AutoGen Visualized - Visual Tools for Multi-Agent Development.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.flowgen.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'tiwater', // Usually your GitHub org/user name.
  projectName: 'flowgen', // Usually your repo name.
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          sidebarCollapsed: false,
          routeBasePath: '',
          showLastUpdateTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/tiwater/flowgen/edit/main/website',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'FlowGen Docs',
      logo: {
        alt: 'FlowGen Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/getting-started',
          label: 'Getting Started',
          position: 'left',
        },
        {
          to: '/tutorials/search-n-write/',
          label: 'Tutorials',
          position: 'left',
        },
        {
          href: 'https://flowgen.app/',
          position: 'right',
          html: `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="50 50 300 300">
              <g id="group13" data-name="group 13" transform="translate(-6327.091 -1946.904)">
                <g id="group_11" data-name="group 11">
                  <path id="path_10" data-name="path 10" d="M6641.667,2098.986h-34.12v47.143c0,44.936-36.762,82.865-81.7,82.549a81.116,81.116,0,0,1-80.533-80.533c-.315-44.934,37.614-81.7,82.55-81.7h47.143v-34.121a68.937,68.937,0,0,1,7.85-31.905h-53.825c-81.513,0-150.315,66.686-149.742,148.2A147.142,147.142,0,0,0,6525.377,2294.7c81.51.572,148.2-68.23,148.2-149.742v-53.826A68.937,68.937,0,0,1,6641.667,2098.986Z" fill="currentColor"/>
                  <path id="path_11" data-name="path 11" d="M6607.344,2033.474v33.178h33.178c18.71,0,34.5-15.308,34.372-34.018a33.775,33.775,0,0,0-33.533-33.532C6622.651,1998.97,6607.344,2014.763,6607.344,2033.474Z" fill="currentColor"/>
                  <path id="path_12" data-name="path 12" d="M6574.154,2146.7v-47.861h-47.861c-26.992,0-49.774,22.082-49.585,49.072a48.724,48.724,0,0,0,48.374,48.373C6552.072,2196.477,6574.154,2173.694,6574.154,2146.7Z" fill="currentColor"/>
                </g>
                <g id="group_12" data-name="group 12">
                  <rect id="rect_6" data-name="rect 6" width="400" height="400" transform="translate(6327.091 1946.904)" fill="none"/>
                </g>
              </g>
            </svg>
            <span style="margin-left: 2px">Platform</span>
          `,
        },
        {
          href: 'https://api.flowgen.app/redoc',
          label: 'API',
          position: 'right',
        },
        {
          href: 'https://github.com/tiwater/flowgen',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      copyright: `© ${new Date().getFullYear()} FlowGen Team. Built with <a target="_blank" href="https://docusaurus.io">Docusaurus</a>.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
