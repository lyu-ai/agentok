import clsx from 'clsx';
import { OptionProps, OptionType } from './option';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
type RangeOptionProps = {
  min: number;
  max: number;
  step?: number;
} & OptionProps;

export const RangeOption = ({
  data,
  label,
  name,
  onChange,
  min,
  max,
  step,
  compact,
}: RangeOptionProps) => {
  return (
    <div
      className={clsx('flex gap-2 text-sm', {
        'flex-col': !compact,
        'items-center': compact,
      })}
    >
      <Label className="whitespace-nowrap">{label}</Label>
      <Slider
        min={min ?? 0}
        max={max ?? 100}
        step={step ?? 1}
        value={data?.[name] ?? 0}
        onValueChange={(value) => onChange && onChange(name, value)}
        className="range range-xs nodrag focus:range-primary w-full p-1"
      />
      [{data?.[name] ?? 'None'}]
    </div>
  );
};
