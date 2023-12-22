import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus as style } from 'react-syntax-highlighter/dist/esm/styles/prism';
import RemarkBreaks from 'remark-breaks';
import RemarkGfm from 'remark-gfm';
import './markdown.css';
import CopyButton from '../CopyButton';
import { common, createLowlight } from 'lowlight';
import clsx from 'clsx';

const lowlight = createLowlight(common);

const CodeBlock = ({ language, children }: any) => {
  const detectedLanguage =
    language || lowlight.highlightAuto(children).data?.language;
  return (
    <SyntaxHighlighter
      language={detectedLanguage}
      style={style}
      wrapLongLines
      className="rounded-md p-2 my-2"
    >
      {children}
    </SyntaxHighlighter>
  );
};

const InlineCode = ({ children }: any) => (
  <code className="bg-base-300 p-1 rounded-md text-sm mx-1">{children}</code>
);

const CodeComponent = ({
  node,
  inline,
  className,
  children,
  ...props
}: any) => {
  const match = /language-(\w+)/.exec(className || '');
  if (inline) return <InlineCode {...props}>{children}</InlineCode>;
  return (
    <div className="relative">
      <CodeBlock language={match && match[1]} {...props}>
        {String(children).replace(/\n$/, '')}
      </CodeBlock>
      <CopyButton
        content={String(children).replace(/\n$/, '')}
        className="absolute top-1 right-1"
      />
    </div>
  );
};

const Markdown = ({ className, children }: any) => {
  // This function is for image format in autogen
  function preprocessImageTags(content: string): string {
    // Regex to find <img> tags with the assumed format
    const imgTagRegex = /<img (https?:\/\/[^">]+)>/g;

    // Replacement function to convert to Markdown
    const replaceWithMarkdown = (match: string, p1: string) => {
      // p1 contains the first capture group: the URL of the image
      return `![img](${p1})`;
    };

    // Replace all occurrences in the content
    return content.replace(imgTagRegex, replaceWithMarkdown);
  }

  const markdownWithImages: string = preprocessImageTags(children as string);

  return (
    <ReactMarkdown
      remarkPlugins={[RemarkGfm, RemarkBreaks]}
      components={{
        code: CodeComponent,
        a(data): JSX.Element {
          return <a target="_blank" style={{ color: '#0022cc' }} {...data} />;
        },
        img: ({ node, ...props }) => (
          <img style={{ maxWidth: '480px', maxHeight: '320px' }} {...props} />
        ),
      }}
      className={clsx(className, `markdown`)}
    >
      {markdownWithImages}
    </ReactMarkdown>
  );
};

export default Markdown;
