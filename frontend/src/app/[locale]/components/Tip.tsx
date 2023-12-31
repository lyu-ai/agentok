import React, { useEffect } from 'react';
import { GoQuestion } from 'react-icons/go';
import Markdown from '@/components/Markdown';
import { createRoot } from 'react-dom/client';
import clsx from 'clsx';

const Tip = ({ content, icon, className, classNameContent, ...props }: any) => {
  const [htmlContent, setHtmlContent] = React.useState('');
  useEffect(() => {
    let isMounted = true; // Guard to prevent setting state if the component is unmounted
    if (typeof content === 'string') {
      renderToString(
        <Markdown className={classNameContent} suppressCopy>
          {content}
        </Markdown>
      ).then(html => {
        if (isMounted) setHtmlContent(html);
      });
    } else {
      renderToString(content).then(html => {
        if (isMounted) setHtmlContent(html);
      });
    }

    return () => {
      isMounted = false; // Component cleanup
    };
  }, [content, classNameContent]);

  // Discussion: https://github.com/vercel/next.js/discussions/58533
  const renderToString = async (element: React.ReactElement) => {
    const container = document.createElement('div');
    const root = createRoot(container);
    root.render(element);

    await new Promise(resolve => setTimeout(resolve, 100)); // wait for the rendering to complete

    const html = container.innerHTML;
    root.unmount();

    return html;
  };

  return (
    <div
      data-tooltip-id="html-tooltip"
      data-tooltip-html={htmlContent}
      data-tooltip-place="top"
      className={clsx(className, 'cursor-pointer')}
      {...props}
    >
      {icon ?? <GoQuestion className="w-4 h-4" />}
    </div>
  );
};

export default Tip;
