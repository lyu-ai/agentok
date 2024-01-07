import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import React, { useState, useEffect, useCallback } from 'react';

export default function ApiDocs() {
  const { siteConfig } = useDocusaurusContext();
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute('data-theme')
  );
  const [key, setKey] = useState(1);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const redocScript = document.createElement('script');
    redocScript.src =
      'https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js';
    redocScript.async = true;
    document.body.appendChild(redocScript);

    return () => {
      document.body.removeChild(redocScript);
    };
  }, []);

  useEffect(() => {
    setKey(prevKey => prevKey + 1); // Incrementing the key to force a re-render
  }, [theme]);

  const RedocStandalone = useCallback(() => {
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
    console.log('render', theme, darkTheme);

    return (
      <redoc
        key={key}
        spec-url="http://localhost:5004/openapi.json"
        expand-responses="all"
        hide-download-button="true"
        scroll-y-offset="nav"
        theme={
          theme === 'dark' ? JSON.stringify(darkTheme) : JSON.stringify({})
        }
      ></redoc>
    );
  }, [theme]);

  return (
    <Layout title={`${siteConfig.title}`} description="AutoGen Visualized">
      <div id="redoc-container" key={key}>
        <RedocStandalone />
      </div>
    </Layout>
  );
}
