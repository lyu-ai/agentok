import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { GoImage, GoTrash } from 'react-icons/go';

type ImagePanelProps = {
  onSelectImage: (url: string) => void;
  className?: string;
};

const sampleImages = [
  'https://th.bing.com/th/id/OIP.29Mi2kJmcHHyQVGe_0NG7QHaEo?pid=ImgDet&rs=1',
  'https://th.bing.com/th/id/R.422068ce8af4e15b0634fe2540adea7a?rik=y4OcXBE%2fqutDOw&pid=ImgRaw&r=0',
  'https://fftai.github.io/concepts/static/about_gr1.png',
  'https://assets.csn.chat/flowgen/duck.jpg',
];

const ImagePanel = (props: ImagePanelProps) => {
  const [url, setUrl] = useState('');
  useEffect(() => {
    props.onSelectImage(url);
  }, [url]);
  return (
    <div
      className={clsx('relative flex flex-col py-1 w-full h-full rounded-t-md')}
    >
      <div
        className={clsx(
          'flex flex-col items-center justify-center w-full h-full border-base-content/20 gap-2 text-base-content/40',
          props.className
        )}
      >
        {url ? (
          <div className="h-full aspect-w-1 aspect-h-1 overflow-hidden">
            <img src={url} alt="image" className="object-cover w-full h-full" />
            <button
              className="btn btn-xs btn-ghost text-red-300 hover:text-red-500 btn-square absolute top-1 right-1"
              onClick={() => setUrl('')}
            >
              <GoTrash className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 justify-center items-center w-full h-full">
            <GoImage className="w-12 h-12 mx-auto" />
            <div className="text-sm font-bold">图片预览</div>
            <div className="flex items-center gap-2">
              {sampleImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setUrl(image)}
                  className="rounded border border-transparent hover:border-secondary hover:bg-secondary overflow-hidden bg-base-content/30"
                >
                  <img
                    src={image}
                    alt="image"
                    className="h-10 w-10 object-cover "
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-1">
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          className="input input-xs input-bordered rounded-sm w-full bg-base-100/40"
          placeholder="请在此输入你想随消息发送的图片 URL"
        />
      </div>
    </div>
  );
};

export default ImagePanel;
