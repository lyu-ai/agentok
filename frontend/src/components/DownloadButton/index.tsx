import { GoDownload } from 'react-icons/go';

const DownloadButton = ({ data, label, filename }: any) => {
  const onExport = () => {
    // Create a Blob from the JSON data
    const blob = new Blob([data], { type: 'text/plain' });

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
      data-tooltip-content={label}
    >
      <GoDownload className="w-4 h-4" />
    </button>
  );
};

export default DownloadButton;
