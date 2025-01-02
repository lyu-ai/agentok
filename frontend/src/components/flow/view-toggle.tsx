import { Icons } from '../icons';
import { Button } from '../ui/button';

type modeType = 'main' | 'flow' | 'json' | 'python';

export const ViewToggle = ({
  mode,
  setMode,
}: {
  mode: modeType;
  setMode: (mode: modeType) => void;
}) => {
  const ModeIcon =
    mode === 'flow' ? Icons.home : mode === 'json' ? Icons.braces : Icons.code;
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6"
      onClick={() => setMode(mode)}
    >
      <ModeIcon className="shrink-0 w-4 h-4" />
    </Button>
  );
};
