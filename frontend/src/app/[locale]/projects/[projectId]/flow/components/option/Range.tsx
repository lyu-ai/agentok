import clsx from 'clsx';
import { OptionProps, OptionType } from './Option';

type RangeOptionProps = {
  min: number;
  max: number;
  step?: number;
} & OptionProps;

const RangeOption = ({
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
      className={clsx('flex gap-1', {
        'flex-col': !compact,
        'items-center': compact,
      })}
    >
      <label>
        {label}:[{data?.[name] ?? 'None'}]
      </label>
      <input
        type="range"
        min={min ?? 0}
        max={max ?? 100}
        step={step ?? 1}
        value={data?.[name] ?? 0}
        onChange={e => onChange && onChange(name, e.target.valueAsNumber)}
        className="range range-xs nodrag focus:range-primary w-full p-1"
      />
    </div>
  );
};

export default RangeOption;
