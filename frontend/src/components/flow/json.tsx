import { CopyButton } from '@/components/copy-button';
import { ViewToggle } from './view-toggle';
import { Icons } from '@/components/icons';
import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from '@/hooks/use-toast';
import { DownloadButton } from '@/components/download-button';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark as theme } from '@uiw/codemirror-theme-vscode';
import { json } from '@codemirror/lang-json';

const ImportIcon = ({ onImport }: any) => {
  const t = useTranslations('page.Json');
  const fileInputRef = useRef<any>();

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0]; // Get the first file
    if (!file) {
      toast({
        title: 'No file chosen',
      });
      return;
    }
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const json = JSON.parse(e.target.result);

        onImport && onImport(json);
      } catch (error) {
        toast({
          title: t('Failed to parse the file content'),
        });
      }
    };

    reader.onerror = () => {
      toast({
        title: t('Failed to read file.'),
      });
    };

    reader.readAsText(file);

    // Reset the file value
    event.target.value = '';
  };

  return (
    <div>
      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }} // Hide the actual input element
        ref={fileInputRef}
      />
      <button
        className="btn btn-sm btn-square btn-ghost"
        onClick={handleIconClick}
        data-tooltip-id="default-tooltip"
        data-tooltip-content={t('import')}
      >
        <Icons.upload className="w-4 h-4" />
      </button>
    </div>
  );
};

export const Json = ({ data, setMode, onSave }: any) => {
  const [code, setCode] = useState(JSON.stringify(data, null, 2));
  const t = useTranslations('page.Json');
  const handleSave = () => {
    try {
      const json = JSON.parse(code);
      onSave(json);
      toast({
        title: t('Saved successfully'),
      });
      setMode('flow');
    } catch (error) {
      toast({
        title: t('Failed to parse the JSON'),
      });
    }
  };
  return (
    <div className="relative w-full h-full">
      <CodeMirror
        value={code ?? ''}
        height="100%"
        theme={theme}
        extensions={[json()]}
        onChange={(value) => setCode(value)}
        style={{ fontSize: '0.75rem', height: '100%' }}
      />
      <div className="absolute flex items-center gap-2 right-4 top-2">
        <ViewToggle mode={'flow'} setMode={setMode} />
        <button
          className="btn btn-sm btn-circle btn-ghost"
          data-tooltip-id="default-tooltip"
          data-tooltip-content={'Save'}
          onClick={() => handleSave()}
        >
          <Icons.save className="w-4 h-4" />
        </button>
        <ViewToggle mode={'python'} setMode={setMode} />
        <CopyButton content={code} />
        <DownloadButton
          data={JSON.stringify(data, null, 2)}
          label={t('download')}
          filename={`${
            data?.name ?? 'agentok-data'
          }-${new Date().toLocaleString()}.json`}
        />
      </div>
    </div>
  );
};
