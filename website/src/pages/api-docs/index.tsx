import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import React, { useState, useEffect } from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const isBrowser = ExecutionEnvironment.canUseDOM;

const darkTheme = {
  colors: {
    text: {
      primary: '#ffffff',
      secondary: '#ffffff',
      disabled: '#ffffff',
      hint: '#ffffff',
      icon: '#ffffff',
      divider: '#ffffff',
      light: '#ffffff',
      dark: '#ffffff',
      contrastText: '#ffffff',
    },
  },
  sidebar: {
    backgroundColor: '#1f2937',
    textColor: '#ffffff',
  },
};

// This component will be initialized only on the client-side
const RedocStandalone = ({ theme }) => {
  const key = React.useMemo(() => Math.random(), [theme]); // Generate a key based on the theme

  useEffect(() => {
    if (isBrowser) {
      const redocScript = document.createElement('script');
      redocScript.src =
        'https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js';
      redocScript.async = true;
      document.body.appendChild(redocScript);
      return () => {
        document.body.removeChild(redocScript);
      };
    }
  }, []);

  return (
    <redoc
      key={key}
      spec-url="https://api.agentok.ai/openapi.json"
      expand-responses="all"
      hide-download-button="true"
      scroll-y-offset="nav"
      theme={theme === 'dark' ? JSON.stringify(darkTheme) : JSON.stringify({})}
    />
  );
};

export default function ApiDocs() {
  const { siteConfig } = useDocusaurusContext();
  const [theme, setTheme] = useState(
    isBrowser ? document.documentElement.getAttribute('data-theme') : 'light'
  );

  useEffect(() => {
    if (isBrowser) {
      setTheme(document.documentElement.getAttribute('data-theme'));

      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'data-theme'
          ) {
            setTheme(document.documentElement.getAttribute('data-theme'));
          }
        });
      });

      observer.observe(document.documentElement, {
        attributes: true,
      });

      return () => observer.disconnect();
    }
  }, []);

  return (
    <Layout title={`${siteConfig.title}`} description="AutoGen Visualized">
      {/* Ensure this part is only executed in the browser */}
      {isBrowser && (
        <div id="redoc-container">
          <RedocStandalone theme={theme} />
        </div>
      )}
    </Layout>
  );
}
