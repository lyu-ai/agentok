import { cn } from '@/lib/utils';
import { OptionProps } from './option';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type NumberOptionProps = {} & OptionProps;

export const NumberOption = ({
  data,
  label,
  name,
  onValueChange,
  compact,
}: NumberOptionProps) => {
  const [value, setValue] = useState(data?.[name] ?? 0);
  return (
    <div
      className={cn('flex gap-2', {
        'flex-col': !compact,
        'items-center': compact,
      })}
    >
      <Label className="whitespace-nowrap">{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.valueAsNumber)}
        onBlur={(e) =>
          onValueChange && onValueChange(name, e.target.valueAsNumber)
        }
        className="input input-xs input-bordered w-24 bg-transparent focus:input-primary rounded px-0 pl-1"
      />
    </div>
  );
};
