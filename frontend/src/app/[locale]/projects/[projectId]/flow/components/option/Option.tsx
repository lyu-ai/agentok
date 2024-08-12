import TextOption from "./Text";
import NumberOption from "./Number";
import OptionGroup from "./OptionGroup";
import { setEdgeData, setNodeData } from "../../utils/flow";
import { useReactFlow } from "reactflow";
import RangeOption from "./Range";
import SelectOption from "./Select";
import CheckOption from "./Check";

export type OptionType = {
  type: string; // text, number, group ...
  label: string; // Displayed label, key in the i18n json
  description?: string; // Displayed description, key in the i18n json
  name: string; // Key in the node data
  onChange?: (key: string, value: any) => void;
};

export type OptionProps = {
  reactflowInstance?: any;
  nodeId: string;
  data?: any;
  compact?: boolean;
} & OptionType &
  React.HTMLAttributes<HTMLDivElement> &
  Record<string, any>; // Allow arbitrary attributes;

type OptionDict = {
  [key: string]: React.ComponentType<any>;
};

const UnsupportedOption = ({ type }: { type: string }) => {
  return (
    <div className="flex items-center justify-center w-full rounded-sm p-4 border border-error text-error bg-error/10">
      <p>
        Option type <span className="font-bold">{type}</span> is not supported
        yet
      </p>
    </div>
  );
};

const GenericOption = ({ type, onChange, ...props }: OptionProps) => {
  const optionDict: OptionDict = {
    text: TextOption,
    number: NumberOption,
    range: RangeOption,
    select: SelectOption,
    check: CheckOption,
    group: OptionGroup,
  };
  const instance = useReactFlow();
  const handleChange = (name: string, value: any) => {
    if (onChange) {
      onChange(name, value);
    } else if (props.nodeId.startsWith("reactflow__edge")) {
      setEdgeData(instance, props.nodeId, { [name]: value });
    } else {
      // Default onChange
      setNodeData(instance, props.nodeId, { [name]: value });
    }
  };

  const OptionComponent = optionDict[type];
  if (!OptionComponent) {
    console.warn(`Option type ${type} is not supported`);
    return <UnsupportedOption type={type} />;
  }

  return <OptionComponent onChange={handleChange} {...props} />;
};

export default GenericOption;
