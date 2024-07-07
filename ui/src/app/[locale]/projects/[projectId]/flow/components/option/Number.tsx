import { OptionType } from './types';

type NumberOptionProps = {
  option: OptionType;
  onChange: (option: { type: string; value: string }) => void;
  compact?: boolean; // Show title and value on the same line
};

const NumberOption = ({
  option,
  onChange,
  compact = false,
}: NumberOptionProps) => {
  return (
    <div>
      <input
        type="text"
        value={option.value}
        onChange={e => onChange({ ...option, value: e.target.value })}
      />
    </div>
  );
};

export default NumberOption;
