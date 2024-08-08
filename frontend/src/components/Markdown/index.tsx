import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus as style } from "react-syntax-highlighter/dist/esm/styles/prism";
import RemarkBreaks from "remark-breaks";
import RemarkGfm from "remark-gfm";
import RemarkMath from "remark-math";
import RehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import "./markdown.css";
import CopyButton from "../CopyButton";
import { common, createLowlight } from "lowlight";
import clsx from "clsx";

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
  suppressCopy,
  ...props
}: any) => {
  const match = /language-(\w+)/.exec(className || "");
  if (inline) return <InlineCode {...props}>{children}</InlineCode>;
  return (
    <div className="relative">
      <CodeBlock language={match && match[1]} {...props}>
        {String(children).replace(/\n$/, "")}
      </CodeBlock>
      {!suppressCopy && (
        <CopyButton
          minimal
          content={String(children).replace(/\n$/, "")}
          className="absolute top-1 right-1"
        />
      )}
    </div>
  );
};

const Markdown = ({
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
    .replace(/\\\((.*?)\\\)/g, (match, p1) => `$${p1}$`)
    .replace(/\\\[(.*?)\\\]/gs, (match, p1) => `$$${p1}$$`);

  return (
    <ReactMarkdown
      remarkPlugins={[RemarkGfm, RemarkBreaks, RemarkMath]}
      rehypePlugins={[RehypeKatex]}
      components={{
        code(data): JSX.Element {
          return <CodeComponent {...data} suppressCopy={suppressCopy} />;
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
            style={{ maxWidth: "480px", width: "100%", maxHeight: "320px" }}
            alt={props.alt ?? "md-img"}
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

export default Markdown;
