import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  vscDarkPlus,
  vs,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import RemarkBreaks from 'remark-breaks';
import RemarkMath from 'remark-math';
import RehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import './markdown.css';
import { CopyButton } from '../copy-button';
import { common, createLowlight } from 'lowlight';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
const lowlight = createLowlight(common);

const CodeBlock = ({ language, children }: any) => {
  const { resolvedTheme } = useTheme();
  const style = resolvedTheme === 'dark' ? vscDarkPlus : vs;
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
  <code className="px-[0.3rem] py-[0.2rem] font-mono text-sm bg-muted rounded-md">
    {children}
  </code>
);

const CodeComponent = ({
  node,
  inline,
  className,
  children,
  suppressCopy,
  ...props
}: any) => {
  const match = /language-(\w+)/.exec(className || '');

  // Handle inline code differently
  if (inline) {
    return <InlineCode {...props}>{children}</InlineCode>;
  }

  // Only wrap in div and add copy button for block code
  return (
    <div className="relative">
      <CodeBlock language={match && match[1]} {...props}>
        {children}
      </CodeBlock>
      {!suppressCopy && (
        <CopyButton
          content={String(children).replace(/\n$/, '')}
          className="absolute top-1 right-1"
        />
      )}
    </div>
  );
};

export const Markdown = ({
  className,
  suppressLink,
  suppressCopy,
  children,
  ...props
}: any) => {
  if (!children) return null;

  function preprocessImageTags(content: string): string {
    const imgTagRegex = /<img (https?:\/\/[^">]+)>/g;
    return content.replace(imgTagRegex, (match, p1) => `![img](${p1})`);
  }

  const markdownWithImages: string = preprocessImageTags(children as string);

  const processedMarkdown = markdownWithImages
    // Replace both leading and trailing horizontal rules with escaped versions
    .replace(/^---\n(.*?)\n---/ms, '\\---\n$1\n\\---')
    // Also handle single horizontal rules after text
    .replace(/^(.+)\n---/m, '$1\n\n---')
    .replace(/\\\((.*?)\\\)/g, (match, p1) => `$${p1}$`)
    .replace(/\\\[(.*?)\\\]/gs, (match, p1) => `$$${p1}$$`);

  return (
    <ReactMarkdown
      remarkPlugins={[RemarkBreaks, RemarkMath]}
      rehypePlugins={[RehypeKatex]}
      components={{
        code(props: any) {
          const isInline =
            props.node?.position?.start.line === props.node?.position?.end.line;
          const match = /language-(\w+)/.exec(props.className || '');
          return (
            <CodeComponent
              inline={isInline}
              className={props.className}
              language={match?.[1]}
              {...props}
            >
              {props.children}
            </CodeComponent>
          );
        },
        p({ node, children, ...props }) {
          // Replace <p> with <div>
          return <div {...props}>{children}</div>;
        },
        a(data): JSX.Element {
          return suppressLink ? (
            <span className="text-primary" {...data} />
          ) : (
            <a
              target="_blank"
              className="text-primary link link-hover"
              {...data}
            />
          );
        },
        img: ({ node, ...props }) => (
          <img
            style={{ maxWidth: '480px', width: '100%', maxHeight: '320px' }}
            alt={props.alt ?? 'md-img'}
            {...props}
          />
        ),
      }}
      className={clsx(className, `markdown`)}
      {...props}
    >
      {processedMarkdown}
    </ReactMarkdown>
  );
};
