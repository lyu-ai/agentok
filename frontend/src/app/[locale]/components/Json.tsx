import CopyButton from '@/components/CopyButton';
import SyntaxHighlighter from 'react-syntax-highlighter';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';
import ViewToggle from './ViewToggle';

const Json = ({ data, setMode }: any) => {
  const json = JSON.stringify(data, null, 2);
  return (
    <div className="relative w-full h-full">
      <SyntaxHighlighter
        language="json"
        style={style}
        wrapLongLines
        className="h-full text-xs text-base-content"
      >
        {json}
      </SyntaxHighlighter>
      <div className="absolute flex items-center gap-2 right-2 top-2">
        <ViewToggle mode={'flow'} setMode={setMode} />
        <ViewToggle mode={'python'} setMode={setMode} />
        <CopyButton content={json} />
      </div>
    </div>
  );
};

export default Json;
