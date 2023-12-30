import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  image: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Multi-Agents',
    image: '/img/rag.png',
    description: <>Built on the promising AutoGen framework from Microsoft.</>,
  },
  {
    title: 'Fully Visualized',
    image: '/img/flow.png',
    description: (
      <>
        Visualize the Agents and Agent Autoflow, further simplifies the building
        of Multi-Agents Apps.
      </>
    ),
  },
  {
    title: 'Open with AI',
    image: '/img/api.png',
    description: (
      <>
        Extend or customize the flow with Python, and let AI write the Python
        code for you.
      </>
    ),
  },
];

function Feature({ title, image, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      {/* <div className="text--center">
        <img src={image} className={styles.featureImage} role="img" />
      </div> */}
      <div className="text--center padding-horiz--md">
        <Heading as="h3" className="text--primary">
          {title}
        </Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
