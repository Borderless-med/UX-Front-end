import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useNavigate } from 'react-router-dom';
import 'highlight.js/styles/github.css';

interface MarkdownRendererProps {
  content: string;
  isUser?: boolean;
}

const MarkdownRenderer = ({ content, isUser = false }: MarkdownRendererProps) => {
  const navigate = useNavigate();
  
  return (
    <div className={`markdown-content ${isUser ? 'user' : 'ai'}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-lg font-bold mb-2 text-foreground">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-bold mb-2 text-foreground">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-bold mb-1 text-foreground">{children}</h3>
          ),
          
          // Paragraphs
          p: ({ children }) => (
            <p className="text-sm leading-relaxed mb-2 last:mb-0">{children}</p>
          ),
          
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-sm mb-2 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-sm mb-2 space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-sm">{children}</li>
          ),
          
          // Code
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono text-foreground">
                  {children}
                </code>
              );
            }
            return (
              <code className={className}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-muted p-3 rounded-md overflow-x-auto text-xs font-mono mb-2 border">
              {children}
            </pre>
          ),
          
          // Links
          a: ({ href, children }) => {
            // Check if link is internal (starts with /)
            const isInternal = href?.startsWith('/');
            
            const handleClick = (e: React.MouseEvent) => {
              if (isInternal && href) {
                e.preventDefault();
                console.log('Chat link clicked - navigating to:', href);
                try {
                  navigate(href);
                } catch (error) {
                  console.error('Navigation failed, using fallback:', error);
                  window.location.href = href;
                }
              }
            };
            
            return (
              <a
                href={href}
                onClick={handleClick}
                {...(!isInternal && { 
                  target: "_blank", 
                  rel: "noopener noreferrer" 
                })}
                className="text-primary hover:text-primary/80 underline transition-colors cursor-pointer"
              >
                {children}
              </a>
            );
          },
          
          // Emphasis
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground">{children}</em>
          ),
          
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/30 pl-3 text-muted-foreground italic mb-2">
              {children}
            </blockquote>
          ),
          
          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto mb-2">
              <table className="min-w-full text-xs border border-border rounded">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border p-2 bg-muted font-semibold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border p-2">
              {children}
            </td>
          ),
          
          // Horizontal rule
          hr: () => (
            <hr className="border-border my-3" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;