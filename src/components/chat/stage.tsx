import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  AudioLines,
  Check,
  ChevronDown,
  Copy,
  Globe,
  Image as ImageIcon,
  Lightbulb,
  Mic,
  Paperclip,
  Pencil,
  Plus,
  RefreshCw,
  Square,
  Telescope,
  ThumbsDown,
  ThumbsUp,
  Volume2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { Logo } from "./logo";
import { Markdown } from "./markdown";
import { editAndResend, regenerate, sendComposer, stopGeneration } from "./send";
import { activeChat, useChat } from "./store";
import { HEADLINES, MODELS, type Attachment, type Message, type ToolMode } from "./types";

function Headline() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % HEADLINES.length), 4200);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <h1 key={HEADLINES[index]} className="headline-in text-center text-2xl font-medium tracking-tight sm:text-3xl">
      {HEADLINES[index]}
    </h1>
  );
}

function ModelMenu({ align }: { align: "left" | "right" }) {
  const model = useChat((s) => s.model);
  const setModel = useChat((s) => s.setModel);
  const [open, setOpen] = useState(false);
  const current = MODELS.find((item) => item.id === model) ?? MODELS[0];
  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-sm text-muted hover:bg-hover"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {align === "right" && <span className="hidden max-w-36 truncate sm:inline">{current.label}</span>}
        {align === "left" && <span className="font-medium text-fg">Stick AI</span>}
        <ChevronDown className="size-4" />
      </button>
      {open && (
        <>
          <button className="fixed inset-0 z-20 cursor-default" aria-label="Close model menu" onClick={() => setOpen(false)} />
          <div
            className={cn(
              "shadow-pop absolute z-30 mt-1 w-80 rounded-2xl border border-line bg-elevated p-1.5",
              align === "right" ? "right-0" : "left-0",
            )}
          >
            {MODELS.map((item) => (
              <button
                key={item.id}
                type="button"
                className="flex w-full items-start gap-2 rounded-xl px-3 py-2.5 text-left hover:bg-hover"
                onClick={() => {
                  setModel(item.id);
                  setOpen(false);
                }}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-sm">{item.label}</span>
                  <span className="block text-xs text-muted">{item.blurb}</span>
                </span>
                {item.id === model && <Check className="mt-0.5 size-4 shrink-0" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const TOOLS: { id: ToolMode; label: string; icon: typeof ImageIcon }[] = [
  { id: "image", label: "Create image", icon: ImageIcon },
  { id: "thinking", label: "Thinking", icon: Lightbulb },
  { id: "research", label: "Deep research", icon: Telescope },
  { id: "search", label: "Web search", icon: Globe },
];

function Composer({ prominent }: { prominent?: boolean }) {
  const mode = useChat((s) => s.mode);
  const setMode = useChat((s) => s.setMode);
  const status = useChat((s) => s.status);
  const seed = useChat((s) => s.seed);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<Attachment[]>([]);
  const [menu, setMenu] = useState(false);
  const box = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!seed) return;
    setText(seed);
    useChat.getState().setSeed("");
    box.current?.focus();
  }, [seed]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [text]);

  async function onFiles(list: FileList | null) {
    if (!list) return;
    const next: Attachment[] = [];
    for (const file of Array.from(list).slice(0, 4)) {
      if (file.type.startsWith("image/")) {
        if (file.size > 1_500_000) {
          toast.error(`${file.name} is too large`);
          continue;
        }
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error("read"));
          reader.readAsDataURL(file);
        });
        next.push({ id: crypto.randomUUID(), name: file.name, kind: "image", dataUrl });
      } else {
        const raw = file.size > 200_000 ? "" : await file.text();
        next.push({
          id: crypto.randomUUID(),
          name: file.name,
          kind: "file",
          text: raw ? raw.slice(0, 8000) : "(file too large to read inline)",
        });
      }
    }
    setFiles((current) => [...current, ...next].slice(0, 4));
  }

  async function submit() {
    if (status === "streaming") {
      stopGeneration();
      return;
    }
    if (useChat.getState().mode === "image" && !text.trim()) {
      toast.error("Describe the image you want.");
      return;
    }
    const result = await sendComposer(text, files);
    if (result === "limit") {
      toast.error("You've reached the preview message limit for this session.");
      return;
    }
    if (result) {
      setText("");
      setFiles([]);
      setMenu(false);
    }
  }

  const placeholder = mode === "image" ? "Describe an image" : mode === "research" ? "What should I research?" : "Ask anything";

  return (
    <div className={cn("composer-shell relative rounded-3xl", prominent ? "p-2" : "p-1.5")}>
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 px-2 pt-1 pb-1">
          {files.map((file) => (
            <span key={file.id} className="inline-flex items-center gap-2 rounded-xl bg-hover px-2 py-1 text-xs">
              {file.kind === "image" && file.dataUrl ? (
                <img src={file.dataUrl} alt="" className="size-8 rounded-md object-cover" />
              ) : (
                <Paperclip className="size-3.5" />
              )}
              <span className="max-w-40 truncate">{file.name}</span>
              <button type="button" aria-label={`Remove ${file.name}`} onClick={() => setFiles((current) => current.filter((item) => item.id !== file.id))}>
                <X className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
      {mode && (
        <div className="px-2 pt-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-hover px-2.5 py-1 text-xs">
            {TOOLS.find((tool) => tool.id === mode)?.label}
            <button type="button" aria-label="Remove tool" onClick={() => setMode(null)}>
              <X className="size-3.5" />
            </button>
          </span>
        </div>
      )}
      <div className="flex items-end gap-1">
        <div className="relative">
          <button
            type="button"
            aria-label="Add files and tools"
            aria-expanded={menu}
            className="grid size-10 place-items-center rounded-full hover:bg-hover"
            onClick={() => setMenu((open) => !open)}
          >
            <Plus className="size-5" />
          </button>
          {menu && (
            <>
              <button className="fixed inset-0 z-20 cursor-default" aria-label="Close tools" onClick={() => setMenu(false)} />
              <div className="shadow-pop absolute bottom-12 left-0 z-30 w-60 rounded-2xl border border-line bg-elevated p-1.5">
                <button
                  type="button"
                  className="flex h-10 w-full items-center gap-2 rounded-xl px-2.5 text-sm hover:bg-hover"
                  onClick={() => {
                    setMenu(false);
                    fileRef.current?.click();
                  }}
                >
                  <Paperclip className="size-4" />
                  Add photos & files
                </button>
                {TOOLS.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    className="flex h-10 w-full items-center gap-2 rounded-xl px-2.5 text-sm hover:bg-hover"
                    onClick={() => {
                      setMode(mode === tool.id ? null : tool.id);
                      setMenu(false);
                      box.current?.focus();
                    }}
                  >
                    <tool.icon className="size-4" />
                    {tool.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <label className="sr-only" htmlFor="composer">
          Message Stick AI
        </label>
        <textarea
          id="composer"
          ref={box}
          rows={1}
          value={text}
          placeholder={placeholder}
          suppressHydrationWarning
          className="max-h-52 min-h-10 flex-1 resize-none bg-transparent py-2.5 text-base outline-none placeholder:text-faint"
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void submit();
            }
          }}
        />
        <ModelMenu align="right" />
        <button
          type="button"
          aria-label="Voice"
          className="grid size-10 place-items-center rounded-full hover:bg-hover"
          onClick={() => useChat.getState().setVoiceOpen(true)}
        >
          <Mic className="size-5" />
        </button>
        {status === "streaming" ? (
          <button
            type="button"
            aria-label="Stop generating"
            className="grid size-10 place-items-center rounded-full bg-accent text-accent-fg"
            onClick={stopGeneration}
          >
            <Square className="size-3.5 fill-current" />
          </button>
        ) : text.trim() || files.length ? (
          <button
            type="button"
            aria-label="Send"
            className="grid size-10 place-items-center rounded-full bg-accent text-accent-fg"
            onClick={() => void submit()}
          >
            <ArrowUp className="size-5" />
          </button>
        ) : (
          <button
            type="button"
            aria-label="Voice mode"
            className="grid size-10 place-items-center rounded-full bg-accent text-accent-fg"
            onClick={() => useChat.getState().setVoiceOpen(true)}
          >
            <AudioLines className="size-5" />
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        multiple
        accept="image/*,.txt,.md,.json,.csv,.js,.ts,.tsx,.py,.html,.css"
        suppressHydrationWarning
        onChange={(event) => {
          void onFiles(event.target.files);
          event.target.value = "";
        }}
      />
    </div>
  );
}

function Disclaimer({ saveHint }: { saveHint?: boolean }) {
  const user = useChat((s) => s.user);
  return (
    <p className="px-2 pt-2 text-center text-xs text-faint">
      Stick AI can make mistakes. Check important info.{" "}
      <button type="button" className="underline underline-offset-2" onClick={() => useChat.getState().setLegalOpen(true)}>
        Terms
      </button>
      {" & "}
      <button type="button" className="underline underline-offset-2" onClick={() => useChat.getState().setLegalOpen(true)}>
        Privacy
      </button>
      {saveHint && !user && (
        <>
          {" "}
          <button type="button" className="underline underline-offset-2" onClick={() => useChat.getState().setLoginOpen(true)}>
            Sign up or log in
          </button>{" "}
          to save chats.
        </>
      )}
    </p>
  );
}

const STARTERS: { label: string; mode?: ToolMode; prompt?: string }[] = [
  { label: "Create an image", mode: "image" },
  { label: "Help me write", prompt: "Help me write " },
  { label: "Make a plan", prompt: "Help me make a plan for " },
  { label: "Brainstorm", prompt: "Brainstorm ideas for " },
  { label: "Explain a concept", prompt: "Explain this clearly: " },
];

function MessageView({ message, chatId, isLast }: { message: Message; chatId: string; isLast: boolean }) {
  const status = useChat((s) => s.status);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);
  const [speaking, setSpeaking] = useState(false);
  const streaming = status === "streaming" && isLast && message.role === "assistant" && !message.error;

  if (message.role === "user") {
    return (
      <div className="msg-in group flex justify-end">
        <div className="max-w-[85%]">
          {message.attachments && message.attachments.length > 0 && (
            <div className="mb-2 flex flex-wrap justify-end gap-2">
              {message.attachments.map((file) =>
                file.kind === "image" && file.dataUrl ? (
                  <img key={file.id} src={file.dataUrl} alt={file.name} className="size-20 rounded-2xl object-cover" />
                ) : (
                  <span key={file.id} className="rounded-xl bg-bubble px-3 py-1.5 text-xs">
                    {file.name}
                  </span>
                ),
              )}
            </div>
          )}
          {editing ? (
            <div className="w-[min(70vw,32rem)] rounded-3xl bg-bubble p-3">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                className="min-h-20 w-full resize-none bg-transparent text-base outline-none"
              />
              <div className="mt-2 flex justify-end gap-2">
                <button type="button" className="h-9 rounded-full px-3 text-sm hover:bg-hover" onClick={() => setEditing(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="h-9 rounded-full bg-accent px-3 text-sm text-accent-fg"
                  onClick={() => {
                    setEditing(false);
                    void editAndResend(message.id, draft.trim());
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            message.content && (
              <div className="rounded-3xl bg-bubble px-4 py-2.5 text-base leading-7 whitespace-pre-wrap">{message.content}</div>
            )
          )}
          {!editing && (
            <div className="mt-1 flex justify-end opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
              <button
                type="button"
                aria-label="Edit message"
                className="grid size-8 place-items-center rounded-lg hover:bg-hover"
                onClick={() => {
                  setDraft(message.content);
                  setEditing(true);
                }}
              >
                <Pencil className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="msg-in group">
      {streaming && !message.content && !message.imageUrl && (
        <div className="mb-2 flex items-center gap-2 text-sm text-muted">
          <Logo className="working-spin size-4" />
          Working
        </div>
      )}
      {message.imageUrl && (
        <img src={message.imageUrl} alt={message.content || "Generated image"} className="mb-3 max-h-96 rounded-2xl" />
      )}
      {message.error ? (
        <p className="text-sm text-danger">{message.error}</p>
      ) : (
        message.content && <Markdown source={message.content} />
      )}
      {streaming && message.content && <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-fg align-middle" />}
      {!streaming && (message.content || message.error || message.imageUrl) && (
        <div className={cn("mt-1 flex gap-0.5", !isLast && "sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100")}>
          <button
            type="button"
            aria-label="Copy"
            className="grid size-8 place-items-center rounded-lg hover:bg-hover"
            onClick={() => {
              void navigator.clipboard.writeText(message.content).then(() => toast("Copied"));
            }}
          >
            <Copy className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Good response"
            className={cn("grid size-8 place-items-center rounded-lg hover:bg-hover", message.feedback === "up" && "bg-hover")}
            onClick={() => useChat.getState().setFeedback(chatId, message.id, "up")}
          >
            <ThumbsUp className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Bad response"
            className={cn("grid size-8 place-items-center rounded-lg hover:bg-hover", message.feedback === "down" && "bg-hover")}
            onClick={() => useChat.getState().setFeedback(chatId, message.id, "down")}
          >
            <ThumbsDown className="size-4" />
          </button>
          {message.error ? (
            <button
              type="button"
              aria-label="Retry"
              className="grid size-8 place-items-center rounded-lg hover:bg-hover"
              onClick={() => void regenerate(message.id)}
            >
              <RefreshCw className="size-4" />
            </button>
          ) : (
            isLast && (
              <button
                type="button"
                aria-label="Regenerate"
                className="grid size-8 place-items-center rounded-lg hover:bg-hover"
                onClick={() => void regenerate(message.id)}
              >
                <RefreshCw className="size-4" />
              </button>
            )
          )}
          <button
            type="button"
            aria-label={speaking ? "Stop reading" : "Read aloud"}
            className="grid size-8 place-items-center rounded-lg hover:bg-hover"
            onClick={() => {
              if (speaking) {
                window.speechSynthesis.cancel();
                setSpeaking(false);
                return;
              }
              const utterance = new SpeechSynthesisUtterance(message.content.replace(/```[\s\S]*?```/g, " code "));
              utterance.onend = () => setSpeaking(false);
              setSpeaking(true);
              window.speechSynthesis.cancel();
              window.speechSynthesis.speak(utterance);
            }}
          >
            <Volume2 className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export function ChatStage() {
  const chat = useChat((s) => activeChat(s));
  const empty = !chat || chat.messages.length === 0;
  const scroller = useRef<HTMLDivElement>(null);
  const stick = useRef(true);

  const tail = chat?.messages[chat.messages.length - 1];
  useEffect(() => {
    const el = scroller.current;
    if (!el || !stick.current) return;
    el.scrollTop = el.scrollHeight;
  }, [chat?.id, chat?.messages.length, tail?.content, tail?.imageUrl, tail?.error]);

  if (empty) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-10">
        <Headline />
        <div className="mt-7 w-full max-w-3xl">
          <Composer prominent />
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {STARTERS.map((starter) => (
              <button
                key={starter.label}
                type="button"
                className="h-9 rounded-full border border-line px-3 text-sm hover:bg-hover"
                onClick={() => {
                  if (starter.mode) useChat.getState().setMode(starter.mode);
                  if (starter.prompt) useChat.getState().setSeed(starter.prompt);
                  else document.getElementById("composer")?.focus();
                }}
              >
                {starter.label}
              </button>
            ))}
          </div>
          <Disclaimer />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={scroller}
        className="scroll-thin min-h-0 flex-1 overflow-y-auto"
        onScroll={(event) => {
          const el = event.currentTarget;
          stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 90;
        }}
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6">
          {chat.messages.map((message, index) => (
            <MessageView
              key={message.id}
              message={message}
              chatId={chat.id}
              isLast={index === chat.messages.length - 1}
            />
          ))}
        </div>
      </div>
      <div className="px-3 pb-3">
        <div className="mx-auto w-full max-w-3xl">
          {!stick.current && (
            <div className="mb-2 flex justify-center">
              <button
                type="button"
                className="h-8 rounded-full border border-line bg-canvas px-3 text-xs"
                onClick={() => {
                  stick.current = true;
                  const el = scroller.current;
                  if (el) el.scrollTop = el.scrollHeight;
                }}
              >
                Jump to latest
              </button>
            </div>
          )}
          <Composer />
          <Disclaimer saveHint />
        </div>
      </div>
    </div>
  );
}

export { ModelMenu };
