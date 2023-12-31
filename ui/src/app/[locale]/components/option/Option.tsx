import TextOption from './Text';
import NumberOption from './Number';
import OptionGroup from './OptionGroup';
import { OptionType } from './types';

type Option = {
  type: string;
  value: string;
};

type OptionProps = {
  option: OptionType;
  onChange: (option: Partial<OptionType>) => void;
};

type OptionDict = {
  [key: string]: React.ComponentType<any>;
};

const Option = ({ ...props }: OptionProps) => {
  const { option, onChange } = props;
  const { type } = option;
  const optionDict: OptionDict = {
    text: TextOption,
    number: NumberOption,
    group: OptionGroup,
  };

  const OptionComponent = optionDict[type];
  if (!OptionComponent) {
    console.warn(`Option type ${type} is not supported`);
    return null;
  }

  return <OptionComponent option={option} onChange={onChange} />;
};

export default Option;
