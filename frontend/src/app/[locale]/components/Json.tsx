import CopyButton from '@/components/CopyButton';
import SyntaxHighlighter from 'react-syntax-highlighter';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';
import ViewToggle from './ViewToggle';
import { GoUpload, GoDownload } from 'react-icons/go';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { useFlow } from '@/hooks';

const ImportIcon = ({ onImport }: any) => {
  const t = useTranslations('component.Json');
  const fileInputRef = useRef<any>();

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0]; // Get the first file
    if (!file) {
      toast.error('No file chosen');
      return;
    }
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const json = JSON.parse(e.target.result);

        onImport && onImport(json);
      } catch (error) {
        toast.error(t('Failed to parse the file content'));
      }
    };

    reader.onerror = () => {
      toast.error('Failed to read file.');
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
        <GoUpload className="w-4 h-4" />
      </button>
    </div>
  );
};

const ExportIcon = ({ data, filename }: any) => {
  const t = useTranslations('component.Json');
  const onExport = () => {
    // Create a Blob from the JSON data
    const fileData = JSON.stringify(data, null, 2);
    const blob = new Blob([fileData], { type: 'application/json' });

    // Create an URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a new anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'export.json';
    document.body.appendChild(a);
    a.click();
    a.remove();

    // Cleanup the URL Object after the download
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      className="btn btn-sm btn-square btn-ghost"
      onClick={onExport}
      data-tooltip-id="default-tooltip"
      data-tooltip-content={t('export')}
    >
      <GoDownload className="w-4 h-4" />
    </button>
  );
};

const Json = ({ data, setMode }: any) => {
  const t = useTranslations('component.Json');
  const json = JSON.stringify(data, null, 2);
  const { updateFlow } = useFlow(data?.id);
  const onImport = async (json: any) => {
    const flowToImport = { ...json, id: data.id, owner: data.owner };
    await updateFlow(flowToImport);
  };
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
        <ImportIcon onImport={onImport} />
        <ExportIcon
          data={data}
          filename={`${
            data?.name ?? 'flowgen-data'
          }-${new Date().toLocaleString()}.json`}
        />
      </div>
    </div>
  );
};

export default Json;
