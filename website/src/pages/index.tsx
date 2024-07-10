import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const Svg = require('@site/static/img/logo.svg').default;
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className={styles.container}>
        <Svg className={styles.heroLogo} role="img" />
        <Heading as="h1" className="hero__title text--primary">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--outline button--lg"
            to="/docs/getting-started"
          >
            Getting Started
          </Link>
          <Link
            className="button button--primary button--outline button--lg"
            to="https://studio.agentok.ai/"
          >
            Start to Build
          </Link>
        </div>
        <img
          src="/img/screenshot-studio-1.png"
          className={styles.heroImage}
          alt="hero"
        />
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}`} description="AutoGen Visualized">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
