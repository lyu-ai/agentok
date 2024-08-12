import clsx from "clsx";
import { OptionProps } from "./Option";
import { useState } from "react";

type NumberOptionProps = {} & OptionProps;

const CheckOption = ({ data, label, name, onChange }: NumberOptionProps) => {
  const [value, setValue] = useState(data?.[name] ?? false);
  return (
    <label
      className={clsx(
        "label flex justify-start items-center gap-2 text-sm",
        {}
      )}
    >
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => setValue(e.target.checked)}
        onBlur={(e) => onChange && onChange(name, e.target.checked)}
        className="checkbox checkbox-xs bg-transparent rounded"
      />
      <span>{label}</span>
    </label>
  );
};

export default CheckOption;
