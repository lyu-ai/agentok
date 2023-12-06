import { OptionType } from './types';
import Option from './Option';

type OptionGroupProps = {
  options: OptionType[];
  collapsible?: boolean;
  switch: boolean; // Show a switch to enable/disable the option group
};

const OptionGroup = (props: OptionGroupProps) => {
  const { options, collapsible = false, switch: showSwitch = false } = props;
  if (options.find(option => option.type === 'group')) {
    console.warn('Option group cannot contain another option group', options);
    return null;
  }
  return (
    <div>
      {props.options.map((option, index) => (
        <Option
          option={option}
          key={index}
          onChange={v => console.log('option change' + v)}
        />
      ))}
    </div>
  );
};

export default OptionGroup;
