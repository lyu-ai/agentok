import { OptionType } from './types';

type TextOptionProps = {
  option: OptionType;
  onChange: (option: { type: string; value: string }) => void;
  compact?: boolean; // Show title and value on the same line
};

const TextOption = ({ option, onChange, compact = false }: TextOptionProps) => {
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

export default TextOption;
