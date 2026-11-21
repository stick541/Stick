import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Check, Smartphone, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { AppleMark, GoogleMark, Logo, MicrosoftMark } from "./logo";
import { sendComposer } from "./send";
import { useChat } from "./store";
import type { LocalUser, ThemeChoice } from "./types";

function Modal({
  title,
  subtitle,
  onClose,
  wide,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  wide?: boolean;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button className="scrim absolute inset-0" aria-label="Close dialog" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={cn(
          "shadow-pop relative z-10 max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-elevated p-6 sm:rounded-3xl",
          wide ? "max-w-4xl" : "max-w-md",
        )}
      >
        <button
          type="button"
          aria-label="Close"
          className="absolute top-3 right-3 grid size-10 place-items-center rounded-full hover:bg-hover"
          onClick={onClose}
        >
          <X className="size-5" />
        </button>
        <h2 id="dialog-title" className="pr-8 text-xl font-medium tracking-tight">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "You";
  const clean = local.replace(/[._-]+/g, " ").trim();
  if (!clean) return "You";
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export function LoginModal() {
  const setLoginOpen = useChat((s) => s.setLoginOpen);
  const signIn = useChat((s) => s.signIn);
  const [step, setStep] = useState<"home" | "email" | "phone">("home");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function finish(user: LocalUser) {
    signIn(user);
    toast(`Welcome, ${user.name}`);
  }

  function submitEmail() {
    const email = value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email is not valid.");
      return;
    }
    finish({ name: nameFromEmail(email), email, method: "email" });
  }

  function submitPhone() {
    const phone = value.trim();
    if (phone.replace(/\D/g, "").length < 8) {
      setError("Enter a valid phone number.");
      return;
    }
    finish({ name: "You", email: phone, method: "phone" });
  }

  const social: { id: string; label: string; icon: ReactNode }[] = [
    { id: "google", label: "Continue with Google", icon: <GoogleMark /> },
    { id: "microsoft", label: "Continue with Microsoft", icon: <MicrosoftMark /> },
    { id: "apple", label: "Continue with Apple", icon: <AppleMark /> },
  ];

  return (
    <Modal
      title={step === "home" ? "Log in or sign up" : step === "email" ? "Welcome back" : "Continue with phone"}
      subtitle="You'll get smarter responses and can upload files, images, and more."
      onClose={() => setLoginOpen(false)}
    >
      <div className="mb-4 flex justify-center">
        <Logo className="size-10" />
      </div>
      {step === "home" && (
        <div className="space-y-2">
          {social.map((item) => (
            <button
              key={item.id}
              type="button"
              className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-line text-sm hover:bg-hover"
              onClick={() =>
                finish({
                  name: item.id === "google" ? "Alex" : item.id === "apple" ? "Jordan" : "Sam",
                  email: `${item.id} account`,
                  method: item.id,
                })
              }
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-line text-sm hover:bg-hover"
            onClick={() => {
              setStep("phone");
              setValue("");
              setError("");
            }}
          >
            <Smartphone className="size-5" />
            Continue with phone
          </button>
          <div className="flex items-center gap-3 py-2 text-xs text-faint">
            <span className="h-px flex-1 bg-line" />
            OR
            <span className="h-px flex-1 bg-line" />
          </div>
          <button
            type="button"
            className="h-12 w-full rounded-full border border-line text-sm hover:bg-hover"
            onClick={() => {
              setStep("email");
              setValue("");
              setError("");
            }}
          >
            Continue with email
          </button>
          <p className="pt-2 text-center text-xs text-faint">This preview keeps your session on this device.</p>
        </div>
      )}
      {step !== "home" && (
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (step === "email") submitEmail();
            else submitPhone();
          }}
        >
          <label className="block text-sm" htmlFor="login-value">
            {step === "email" ? "Email address" : "Phone number"}
          </label>
          <input
            id="login-value"
            autoFocus
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setError("");
            }}
            placeholder={step === "email" ? "Email address" : "+1"}
            className="h-12 w-full rounded-full border border-line bg-transparent px-4 outline-none focus:border-fg"
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <button type="submit" className="h-12 w-full rounded-full bg-accent text-sm font-medium text-accent-fg">
            Continue
          </button>
          <button type="button" className="h-10 w-full text-sm text-muted" onClick={() => setStep("home")}>
            Back
          </button>
        </form>
      )}
    </Modal>
  );
}

const THEMES: { id: ThemeChoice; label: string }[] = [
  { id: "system", label: "System" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

export function SettingsModal() {
  const setSettingsOpen = useChat((s) => s.setSettingsOpen);
  const theme = useChat((s) => s.theme);
  const setTheme = useChat((s) => s.setTheme);
  const instructions = useChat((s) => s.instructions);
  const setInstructions = useChat((s) => s.setInstructions);
  const improve = useChat((s) => s.improve);
  const setImprove = useChat((s) => s.setImprove);
  const [tab, setTab] = useState<"general" | "personal" | "data">("general");
  const [confirm, setConfirm] = useState(false);

  return (
    <Modal title="Settings" onClose={() => setSettingsOpen(false)} wide>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex gap-1 sm:w-44 sm:flex-col">
          {(
            [
              ["general", "General"],
              ["personal", "Personalization"],
              ["data", "Data controls"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={cn("h-10 rounded-xl px-3 text-left text-sm hover:bg-hover", tab === id && "bg-hover")}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          {tab === "general" && (
            <div>
              <p className="text-sm font-medium">Theme</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {THEMES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={cn(
                      "h-10 rounded-xl border border-line text-sm",
                      theme === item.id && "border-fg",
                    )}
                    onClick={() => setTheme(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {tab === "personal" && (
            <label className="block text-sm">
              Custom instructions
              <textarea
                value={instructions}
                onChange={(event) => setInstructions(event.target.value.slice(0, 1500))}
                placeholder="How should Stick AI respond?"
                className="mt-2 min-h-36 w-full rounded-2xl border border-line bg-transparent p-3 outline-none focus:border-fg"
              />
            </label>
          )}
          {tab === "data" && (
            <div className="space-y-4">
              <label className="flex items-center justify-between gap-4 text-sm">
                <span>Improve the model for everyone</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={improve}
                  className={cn("h-7 w-12 rounded-full p-1", improve ? "bg-accent" : "bg-line")}
                  onClick={() => setImprove(!improve)}
                >
                  <span className={cn("block size-5 rounded-full bg-canvas transition", improve && "translate-x-5")} />
                </button>
              </label>
              {confirm ? (
                <div className="rounded-2xl border border-line p-3">
                  <p className="text-sm">Delete all chats on this device?</p>
                  <div className="mt-3 flex gap-2">
                    <button type="button" className="h-9 rounded-full px-3 text-sm hover:bg-hover" onClick={() => setConfirm(false)}>
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="h-9 rounded-full bg-danger px-3 text-sm text-on-danger"
                      onClick={() => {
                        useChat.getState().deleteAll();
                        setConfirm(false);
                        toast("Chats deleted");
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <button type="button" className="h-10 rounded-full border border-line px-4 text-sm" onClick={() => setConfirm(true)}>
                  Delete all chats
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export function HelpModal() {
  const setHelpOpen = useChat((s) => s.setHelpOpen);
  return (
    <Modal title="Help" subtitle="A few ways to get around." onClose={() => setHelpOpen(false)}>
      <ul className="space-y-3 text-sm">
        <li className="flex justify-between gap-4"><span>Send a message</span><span className="text-muted">Enter</span></li>
        <li className="flex justify-between gap-4"><span>New line</span><span className="text-muted">Shift + Enter</span></li>
        <li className="flex justify-between gap-4"><span>Search chats</span><span className="text-muted">Ctrl/⌘ K</span></li>
        <li className="flex justify-between gap-4"><span>New chat</span><span className="text-muted">Ctrl/⌘ Shift O</span></li>
        <li className="flex justify-between gap-4"><span>Close a dialog</span><span className="text-muted">Esc</span></li>
      </ul>
      <div className="mt-5 space-y-3 text-sm text-muted">
        <p>Open the + menu to attach a file, create an image, think longer, run deep research, or search the web.</p>
        <p>Chats stay in this browser. Log in on this device to keep a name on the session.</p>
      </div>
    </Modal>
  );
}

export function LegalModal() {
  const setLegalOpen = useChat((s) => s.setLegalOpen);
  return (
    <Modal title="Terms and privacy" onClose={() => setLegalOpen(false)}>
      <div className="space-y-3 text-sm leading-6 text-muted">
        <p>Stick AI is AI and can make mistakes. Check important info.</p>
        <p>
          By using this preview you agree that chats are processed to generate a reply. Conversations are saved in this
          browser unless you delete them. Do not send secrets you would not put in a chat box.
        </p>
        <p>Stick AI is made by Stick. Replies are generated by Grok. Plugins and model names come from the StickAI app.</p>
      </div>
    </Modal>
  );
}

export function SearchModal() {
  const setSearchOpen = useChat((s) => s.setSearchOpen);
  const chats = useChat((s) => s.chats);
  const selectChat = useChat((s) => s.selectChat);
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const sorted = [...chats].sort((a, b) => b.updatedAt - a.updatedAt);
    if (!needle) return sorted.slice(0, 12);
    return sorted
      .filter((chat) => chat.title.toLowerCase().includes(needle) || chat.messages.some((message) => message.content.toLowerCase().includes(needle)))
      .slice(0, 20);
  }, [chats, query]);

  return (
    <Modal title="Search chats" onClose={() => setSearchOpen(false)}>
      <input
        autoFocus
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search chats"
        className="h-12 w-full rounded-full border border-line bg-transparent px-4 outline-none focus:border-fg"
      />
      <div className="mt-3 max-h-80 space-y-1 overflow-y-auto">
        {results.length === 0 && <p className="px-2 py-6 text-center text-sm text-muted">No chats found</p>}
        {results.map((chat) => (
          <button
            key={chat.id}
            type="button"
            className="flex h-11 w-full items-center rounded-xl px-3 text-left text-sm hover:bg-hover"
            onClick={() => selectChat(chat.id)}
          >
            <span className="truncate">{chat.title}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}

export function VoiceOverlay() {
  const setVoiceOpen = useChat((s) => s.setVoiceOpen);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [unsupported, setUnsupported] = useState(false);

  useEffect(() => {
    const Ctor =
      (window as unknown as { SpeechRecognition?: new () => SpeechHandle; webkitSpeechRecognition?: new () => SpeechHandle })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechHandle }).webkitSpeechRecognition;
    if (!Ctor) {
      setUnsupported(true);
      return;
    }
    const recog = new Ctor();
    recog.lang = "en-US";
    recog.interimResults = true;
    recog.continuous = false;
    recog.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i += 1) text += event.results[i][0]?.transcript ?? "";
      setTranscript(text);
    };
    recog.onend = () => setListening(false);
    recog.onerror = () => setListening(false);
    if (listening) recog.start();
    return () => {
      try {
        recog.stop();
      } catch {
        /* not started */
      }
    };
  }, [listening]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-canvas">
      <div className="flex h-14 items-center justify-end px-3">
        <button type="button" aria-label="Close voice" className="grid size-10 place-items-center rounded-full hover:bg-hover" onClick={() => setVoiceOpen(false)}>
          <X className="size-5" />
        </button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className={cn("orb size-40 rounded-full", !listening && "opacity-70")} />
        <p className="mt-8 text-lg">{unsupported ? "Voice input isn't available in this browser." : listening ? "Listening…" : "Tap the orb and speak"}</p>
        <p className="mt-3 max-w-md text-sm text-muted">{transcript || "Your words will show up here."}</p>
        {!unsupported && (
          <button
            type="button"
            className="mt-8 h-11 rounded-full bg-accent px-5 text-sm text-accent-fg"
            onClick={() => setListening((value) => !value)}
          >
            {listening ? "Stop" : "Start"}
          </button>
        )}
        <button
          type="button"
          disabled={!transcript.trim()}
          className="mt-3 h-11 rounded-full px-5 text-sm hover:bg-hover disabled:opacity-40"
          onClick={() => {
            void sendComposer(transcript.trim(), []);
            setVoiceOpen(false);
          }}
        >
          Send transcript
        </button>
      </div>
    </div>
  );
}

type SpeechHandle = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: " / month",
    cta: "Your current plan",
    points: ["Stick on the web", "Limited messages and uploads", "Limited image creation", "Data controls on this device"],
    current: true,
  },
  {
    name: "Plus",
    price: "$20",
    period: " / month",
    cta: "Get Plus",
    points: ["Everything in Free", "Higher message limits", "Stick 2", "More image generations", "Early access to new features"],
    featured: true,
  },
  {
    name: "Pro",
    price: "$200",
    period: " / month",
    cta: "Get Pro",
    points: ["Everything in Plus", "Stick 2.1 and Stick Build", "Maximum reasoning effort", "Deep research at higher limits"],
  },
  {
    name: "Business",
    price: "$25",
    period: " / user / month",
    cta: "Contact sales",
    points: ["A shared workspace", "Admin controls", "SSO", "Your data stays out of training"],
  },
];

export function PricingView() {
  return (
    <div className="scroll-thin min-h-0 flex-1 overflow-y-auto px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-center text-3xl font-medium tracking-tight">See plans and pricing</h1>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted">
          Get smarter responses, upload files, create images, and more. Billing isn't connected in this preview.
        </p>
        <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((plan) => (
            <article key={plan.name} className={cn("flex flex-col rounded-3xl border border-line p-5", plan.featured && "border-fg")}>
              <h2 className="text-lg font-medium">{plan.name}</h2>
              <p className="mt-3">
                <span className="text-3xl font-medium tracking-tight">{plan.price}</span>
                <span className="text-sm text-muted">{plan.period}</span>
              </p>
              <button
                type="button"
                className={cn(
                  "mt-4 h-10 rounded-full text-sm font-medium",
                  plan.current ? "border border-line" : "bg-accent text-accent-fg",
                )}
                onClick={() => {
                  if (plan.current) return;
                  if (!useChat.getState().user) useChat.getState().setLoginOpen(true);
                  else toast("Checkout isn't available in this preview.");
                }}
              >
                {plan.cta}
              </button>
              <ul className="mt-5 space-y-2 text-sm">
                {plan.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ImagesView() {
  const chats = useChat((s) => s.chats);
  const [prompt, setPrompt] = useState("");
  const images = chats.flatMap((chat) =>
    chat.messages
      .filter((message) => message.imageUrl)
      .map((message) => ({ id: message.id, url: message.imageUrl as string, title: chat.title })),
  );

  return (
    <div className="scroll-thin min-h-0 flex-1 overflow-y-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-medium tracking-tight">Images</h1>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!prompt.trim()) return;
            useChat.getState().newChat();
            useChat.getState().setMode("image");
            void sendComposer(prompt.trim(), []);
            useChat.getState().setView("chat");
          }}
        >
          <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Describe a new image"
            className="h-12 flex-1 rounded-full border border-line bg-transparent px-4 outline-none focus:border-fg"
          />
          <button type="submit" className="h-12 rounded-full bg-accent px-4 text-sm text-accent-fg">
            Create
          </button>
        </form>
        {images.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted">Images you create will show up here.</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((image) => (
              <a key={image.id} href={image.url} target="_blank" rel="noreferrer" className="overflow-hidden rounded-2xl border border-line">
                <img src={image.url} alt={image.title} className="aspect-square w-full object-cover" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
