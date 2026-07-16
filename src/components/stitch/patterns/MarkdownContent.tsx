import ReactMarkdown from "react-markdown";

type MarkdownContentProps = {
  content: string;
  className?: string;
};

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div
      className={
        className ??
        "prose prose-sm max-w-none text-stitch-ink prose-headings:font-semibold prose-headings:text-stitch-ink prose-h2:mt-6 prose-h2:text-base prose-h3:mt-4 prose-h3:text-sm prose-p:text-stitch-muted prose-li:text-stitch-muted prose-strong:text-stitch-ink"
      }
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
