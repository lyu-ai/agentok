import clsx from 'clsx';
import { OptionProps } from './Option';

type SelectOptionProps = {
  options: { label: string; value: string }[];
} & OptionProps;

const SelectOption = ({
  data,
  label,
  name,
  onChange,
  options,
  compact,
}: SelectOptionProps) => {
  let selectedIndex = 0;
  if (data?.[name])
    selectedIndex = options.findIndex(o => o.value === data[name]);
  return (
    <div
      className={clsx('flex gap-1', {
        'flex-col': !compact,
        'items-center': compact,
      })}
    >
      <label className="whitespace-nowrap">{label}</label>
      <select
        value={options[selectedIndex].value}
        onChange={e => onChange && onChange(name, e.target.value)}
        className="select select-xs select-bordered bg-transparent nodrag focus:range-primary rounded"
      >
        {options.map((o, i) => (
          <option key={i} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectOption;
