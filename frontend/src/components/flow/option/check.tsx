import { cn } from '@/lib/utils';
import { OptionProps } from './option';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

type NumberOptionProps = {} & OptionProps;

export const CheckOption = ({
  data,
  label,
  name,
  onChange,
}: NumberOptionProps) => {
  const [value, setValue] = useState(data?.[name] ?? false);
  return (
    <label
      className={cn(
        'flex justify-start items-center gap-2 text-sm',
      )}
    >
      <Checkbox
        checked={value}
        onChange={(checked) => setValue(checked)}
        onBlur={() => onChange && onChange(name, value)}
        className="checkbox checkbox-xs bg-transparent rounded"
      />
      <span>{label}</span>
    </label>
  );
};
