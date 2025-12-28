import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
const MarkdownRenderer = ({ content }) => {
  return (
    <div className="text-neutral-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-xl font-bold mt-4 mb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg font-bold mt-4 mb-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-md font-bold mt-4 mb-2" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-sm font-bold mt-4 mb-2" {...props} />
          ),
          h5: ({ node, ...props }) => (
            <h5 className="text-xs font-bold mt-4 mb-2" {...props} />
          ),
          h6: ({ node, ...props }) => (
            <h6 className="text-xs font-bold mt-4 mb-2" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-sm mt-2 mb-2" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-blue-500 hover:underline" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside" {...props} />
          ),
          li: ({ node, ...props }) => <li className="mt-1 mb-1" {...props} />,
          inlineCode: ({ node, ...props }) => (
            <code className="bg-gray-100 px-1 rounded" {...props} />
          ),
          pre: ({ node, ...props }) => (
            <pre
              className="bg-neutral-800 text-white p-4 rounded overflow-x-auto font-mono text-sm my-4"
              {...props}
            />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-bold" {...props} />
          ),
          em: ({ node, ...props }) => <em className="italic" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-2 border-gray-200 pl-4"
              {...props}
            />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                PreTag="div"
                {...props}
                language={match[1]}
                style={dracula}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className="" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
