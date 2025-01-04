import clsx from 'clsx';
import { OptionProps } from './option';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select';

type SelectOptionProps = {
  options: { label: string; value: string }[];
} & OptionProps;

export const SelectOption = ({
  data,
  label,
  name,
  onChange,
  options,
  compact,
}: SelectOptionProps) => {
  let selectedIndex = 0;
  if (data?.[name])
    selectedIndex = options.findIndex((o) => o.value === data[name]);
  return (
    <div
      className={clsx('flex gap-1 text-sm', {
        'flex-col': !compact,
        'items-center': compact,
      })}
    >
      <Label className="whitespace-nowrap">{label}</Label>
      <Select
        value={options[selectedIndex].value}
        onValueChange={(value) => onChange && onChange(name, value)}
      >
        <SelectTrigger>{options[selectedIndex].label}</SelectTrigger>
        <SelectContent>
          {options.map((o, i) => (
            <SelectItem key={i} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
