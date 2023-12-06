import { TbBrandPython } from 'react-icons/tb';
import { PiBracketsCurly } from 'react-icons/pi';
import { RiArrowGoBackLine } from 'react-icons/ri';

type modeType = 'flow' | 'json' | 'python';

const ViewToggle = ({
  mode,
  setMode,
}: {
  mode: modeType;
  setMode: (mode: modeType) => void;
}) => {
  const ModeIcon =
    mode === 'flow'
      ? RiArrowGoBackLine
      : mode === 'json'
      ? PiBracketsCurly
      : TbBrandPython;
  const tip =
    mode === 'flow' ? '回到可视化环境' : mode === 'json' ? 'JSON' : 'Python';

  return (
    <div
      className="btn btn-square btn-ghost btn-sm"
      onClick={() => setMode(mode)}
      data-tooltip-id="default-tooltip"
      data-tooltip-content={tip}
    >
      <ModeIcon className="w-4 h-4" />
    </div>
  );
};

export default ViewToggle;
