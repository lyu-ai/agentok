import { cn } from '@/lib/utils';
import { OptionProps } from './option';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

type NumberOptionProps = {} & OptionProps;

export const CheckOption = ({
  data,
  label,
  name,
  onChange,
}: NumberOptionProps) => {
  const [value, setValue] = useState(data?.[name] ?? false);
  return (
    <div
      className={cn(
        'flex justify-start items-center gap-2 text-sm',
      )}
    >
      <Checkbox
        id={name}
        checked={value}
        onCheckedChange={(checked) => setValue(checked)}
        onBlur={() => onChange && onChange(name, value)}
        className="checkbox checkbox-xs bg-transparent rounded"
      />
      <Label className="whitespace-nowrap" htmlFor={name}>{label}</Label>
    </div>
  );
};
