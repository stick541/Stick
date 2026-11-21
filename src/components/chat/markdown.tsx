import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";

type Block =
  | { type: "code"; lang: string; code: string }
  | { type: "heading"; level: number; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "p"; text: string };

function parse(source: string): Block[] {
  const chunks = source.split("```");
  const blocks: Block[] = [];
  chunks.forEach((chunk, index) => {
    if (index % 2 === 1) {
      const lines = chunk.split("\n");
      const lang = (lines[0] ?? "").trim();
      const code = (lang ? lines.slice(1) : lines).join("\n").replace(/\n$/, "");
      blocks.push({ type: "code", lang, code });
      return;
    }
    blocks.push(...parseText(chunk));
  });
  return blocks;
}

function parseText(source: string): Block[] {
  const lines = source.replace(/\n$/, "").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: { kind: "ul" | "ol"; items: string[] } | null = null;
  let quote: string[] | null = null;

  const flushPara = () => {
    if (!para.length) return;
    blocks.push({ type: "p", text: para.join("\n") });
    para = [];
  };
  const flushList = () => {
    if (!list) return;
    blocks.push(list.kind === "ul" ? { type: "ul", items: list.items } : { type: "ol", items: list.items });
    list = null;
  };
  const flushQuote = () => {
    if (!quote) return;
    blocks.push({ type: "quote", text: quote.join("\n") });
    quote = null;
  };

  for (const line of lines) {
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    const bullet = /^[-*]\s+(.*)$/.exec(line);
    const numbered = /^\d+[.)]\s+(.*)$/.exec(line);
    const quoted = /^>\s?(.*)$/.exec(line);
    if (!line.trim()) {
      flushPara();
      flushList();
      flushQuote();
      continue;
    }
    if (heading) {
      flushPara();
      flushList();
      flushQuote();
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2] });
      continue;
    }
    if (bullet) {
      flushPara();
      flushQuote();
      if (!list || list.kind !== "ul") {
        flushList();
        list = { kind: "ul", items: [] };
      }
      list.items.push(bullet[1]);
      continue;
    }
    if (numbered) {
      flushPara();
      flushQuote();
      if (!list || list.kind !== "ol") {
        flushList();
        list = { kind: "ol", items: [] };
      }
      list.items.push(numbered[1]);
      continue;
    }
    if (quoted) {
      flushPara();
      flushList();
      quote = quote ?? [];
      quote.push(quoted[1]);
      continue;
    }
    flushList();
    flushQuote();
    para.push(line);
  }
  flushPara();
  flushList();
  flushQuote();
  return blocks;
}

function inline(text: string, keyPrefix: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${index++}`;
    if (token.startsWith("**")) nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    else if (token.startsWith("`"))
      nodes.push(
        <code key={key} className="rounded bg-code px-1.5 py-0.5 text-[0.92em]">
          {token.slice(1, -1)}
        </code>,
      );
    else if (token.startsWith("*")) nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    else {
      const linked = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      const href = linked?.[2] ?? "";
      if (linked && /^https?:\/\//.test(href)) {
        nodes.push(
          <a key={key} href={href} target="_blank" rel="noreferrer" className="underline underline-offset-2">
            {linked[1]}
          </a>,
        );
      } else nodes.push(token);
    }
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="my-3 overflow-hidden rounded-2xl bg-code">
      <div className="flex items-center justify-between px-3 py-1.5 text-xs text-muted">
        <span>{lang || "code"}</span>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-hover"
          onClick={() => {
            void navigator.clipboard.writeText(code).then(() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1500);
            });
          }}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 pb-4 text-sm leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function Markdown({ source }: { source: string }) {
  const blocks = parse(source);
  if (!blocks.length) return null;
  return (
    <div className="space-y-3 text-base leading-7">
      {blocks.map((block, index) => {
        const key = `b-${index}`;
        if (block.type === "code") return <CodeBlock key={key} lang={block.lang} code={block.code} />;
        if (block.type === "heading") {
          const Tag = block.level === 1 ? "h2" : "h3";
          return (
            <Tag key={key} className={cn("font-semibold tracking-tight", block.level === 1 ? "text-xl" : "text-lg")}>
              {inline(block.text, key)}
            </Tag>
          );
        }
        if (block.type === "ul" || block.type === "ol") {
          const Tag = block.type === "ul" ? "ul" : "ol";
          return (
            <Tag key={key} className={cn("space-y-1 pl-5", block.type === "ul" ? "list-disc" : "list-decimal")}>
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>{inline(item, `${key}-${itemIndex}`)}</li>
              ))}
            </Tag>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote key={key} className="border-l-2 border-line pl-3 text-muted">
              {inline(block.text, key)}
            </blockquote>
          );
        }
        return (
          <p key={key}>
            {block.text.split("\n").map((line, lineIndex) => (
              <span key={`${key}-${lineIndex}`}>
                {lineIndex > 0 && <br />}
                {inline(line, `${key}-${lineIndex}`)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
