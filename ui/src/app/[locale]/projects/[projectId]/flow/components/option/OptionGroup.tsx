import { PropsWithChildren } from 'react';

type OptionGroupProps = {
  collapsible?: boolean;
  collapseButton?: boolean; // Show a switch to enable/disable the option group
};

const OptionGroup = ({
  collapsible,
  collapseButton,
  children,
}: PropsWithChildren<OptionGroupProps>) => {
  if (collapsible) {
    return <div className="collapse">{children}</div>;
  }
};

export default OptionGroup;
