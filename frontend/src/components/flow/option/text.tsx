import clsx from 'clsx';
import { OptionProps, OptionType } from './option';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type TextOptionProps = {
  rows?: number;
} & OptionProps;

export const TextOption = ({
  data,
  label,
  placeholder,
  name,
  rows,
  onValueChange,
  compact = false,
}: TextOptionProps) => {
  const [value, setValue] = useState(data?.[name] ?? '');

  return (
    <div
      className={clsx('flex text-sm', {
        'flex-col gap-2 ': !compact,
        'items-center gap-2': compact,
      })}
    >
      <Label className="whitespace-nowrap">{label}</Label>
      {rows && rows > 1 ? (
        <Textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => onValueChange && onValueChange(name, value)}
          rows={rows}
          className="focus:text-primary p-1 rounded bg-transparent w-full nodrag nowheel"
        />
      ) : (
        <Input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onBlur={(e) => onValueChange && onValueChange(name, e.target.value)}
          className="focus:text-primary p-1 rounded bg-transparent w-full nodrag nowheel"
        />
      )}
    </div>
  );
};
