import { OptionProps } from './option';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';
type RangeOptionProps = {
  min: number;
  max: number;
  step?: number;
} & OptionProps;

export const RangeOption = ({
  data,
  label,
  name,
  onValueChange,
  min,
  max,
  step,
}: RangeOptionProps) => {
  const [value, setValue] = useState(data?.[name] ?? 0);
  return (
    <div className="flex flex-col gap-2 text-sm">
      <Label className="whitespace-nowrap">
        {label} ({data?.[name] ?? 'None'})
      </Label>
      <div className="flex flex-row gap-2">
        <Label className="text-xs">{min}</Label>
        <Slider
          min={min ?? 0}
          max={max ?? 100}
          step={step ?? 1}
          value={[value]}
          onChange={(value) => console.log(value)}
          onValueChange={(value) => setValue(value[0])}
          onValueCommit={(value) => {
            onValueChange && onValueChange(name, value[0]);
          }}
          className="range range-xs nodrag focus:range-primary w-full p-1"
        />
        <Label className="text-xs">{max}</Label>
      </div>
    </div>
  );
};
