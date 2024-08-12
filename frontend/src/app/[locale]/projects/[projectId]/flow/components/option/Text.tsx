import clsx from 'clsx';
import { OptionProps, OptionType } from './Option';
import { useState } from 'react';

type TextOptionProps = {
  rows?: number;
} & OptionProps;

const TextOption = ({
  data,
  label,
  placeholder,
  name,
  rows,
  onChange,
  compact = false,
}: TextOptionProps) => {
  const [value, setValue] = useState(data?.[name] ?? '');

  return (
    <div
      className={clsx('flex text-sm', {
        'flex-col gap-1 ': !compact,
        'items-center gap-2': compact,
      })}
    >
      <span className="whitespace-nowrap">{label}</span>
      {rows && rows > 1 ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => onChange && onChange(name, value)}
          rows={rows}
          className="textarea textarea-bordered focus:textarea-primary p-1 rounded bg-transparent w-full nodrag nowheel"
        />
      ) : (
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onBlur={(e) => onChange && onChange(name, e.target.value)}
          className="input input-xs input-bordered focus:input-primary p-1 rounded bg-transparent nodrag nowheel"
        />
      )}
    </div>
  );
};

export default TextOption;
