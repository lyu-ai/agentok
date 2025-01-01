import clsx from 'clsx';
import { OptionProps, OptionType } from './option';

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
      className={clsx('flex gap-1 text-sm', {
        'flex-col': !compact,
        'items-center': compact,
      })}
    >
      <label className="whitespace-nowrap">{label}</label>
      <input
        type="range"
        min={min ?? 0}
        max={max ?? 100}
        step={step ?? 1}
        value={data?.[name] ?? 0}
        onChange={(e) => onChange && onChange(name, e.target.valueAsNumber)}
        className="range range-xs nodrag focus:range-primary w-full p-1"
      />
      [{data?.[name] ?? 'None'}]
    </div>
  );
};
