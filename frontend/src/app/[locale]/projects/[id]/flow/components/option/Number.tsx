import clsx from 'clsx';
import { OptionProps } from './Option';
import { useState } from 'react';

type NumberOptionProps = {} & OptionProps;

const NumberOption = ({
  data,
  label,
  name,
  onChange,
  compact,
}: NumberOptionProps) => {
  const [value, setValue] = useState(data?.[name] ?? 0);
  return (
    <div
      className={clsx('flex gap-2', {
        'flex-col': compact,
        'items-center': compact,
      })}
    >
      <span>{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.valueAsNumber)}
        onBlur={(e) => onChange && onChange(name, e.target.valueAsNumber)}
        className="input input-xs input-bordered w-24 bg-transparent focus:input-primary rounded px-0 pl-1"
      />
    </div>
  );
};

export default NumberOption;
