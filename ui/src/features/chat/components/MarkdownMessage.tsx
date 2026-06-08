import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownMessage({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-3 whitespace-pre-wrap last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
        ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
        h1: ({ children }) => <h1 className="mb-3 mt-5 text-xl font-extrabold first:mt-0">{children}</h1>,
        h2: ({ children }) => <h2 className="mb-2 mt-5 text-lg font-extrabold first:mt-0">{children}</h2>,
        h3: ({ children }) => <h3 className="mb-2 mt-4 font-extrabold first:mt-0">{children}</h3>,
        strong: ({ children }) => <strong className="font-extrabold">{children}</strong>,
        code: ({ children }) => <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{children}</code>,
        blockquote: ({ children }) => <blockquote className="my-3 border-l-2 border-primary pl-4 text-muted-foreground">{children}</blockquote>,
        a: ({ children, href }) => <a className="font-medium text-primary underline underline-offset-4" href={href} target="_blank" rel="noreferrer">{children}</a>,
        hr: () => <hr className="my-5" />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
