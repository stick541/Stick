import { useMemo, useState } from "react";
import { Check, Search, X } from "lucide-react";
import { toast } from "sonner";
import { PLUGIN_CATEGORIES, PLUGINS, type Plugin } from "./plugins";
import { useChat } from "./store";

function Logo({ plugin }: { plugin: Plugin }) {
  return (
    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white p-2 ring-1 ring-black/10">
      <img src={plugin.logo} alt="" className="size-full object-contain" />
    </span>
  );
}

export function PluginsView() {
  const enabled = useChat((s) => s.plugins);
  const setPlugin = useChat((s) => s.setPlugin);
  const setSeed = useChat((s) => s.setSeed);
  const newChat = useChat((s) => s.newChat);
  const setView = useChat((s) => s.setView);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof PLUGIN_CATEGORIES)[number]>("All");
  const [open, setOpen] = useState<Plugin | null>(null);

  const list = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return PLUGINS.filter((plugin) => {
      if (category !== "All" && plugin.category !== category) return false;
      if (!needle) return true;
      return (
        plugin.name.toLowerCase().includes(needle) ||
        plugin.tagline.toLowerCase().includes(needle) ||
        plugin.description.toLowerCase().includes(needle)
      );
    });
  }, [query, category]);

  const connect = (plugin: Plugin, on: boolean) => {
    setPlugin(plugin.id, on);
    if (!on) {
      toast(`${plugin.name} disconnected`);
      return;
    }
    toast(
      plugin.account
        ? `${plugin.name} is on. Live account sign-in isn't set up in this preview, so Stick won't read your real ${plugin.name} yet.`
        : `${plugin.name} enabled. A live connection isn't available yet, so Stick will help in preview.`,
    );
  };

  const startWith = (plugin: Plugin, example: string) => {
    setPlugin(plugin.id, true);
    newChat();
    setSeed(example);
    setView("chat");
    setOpen(null);
  };

  return (
    <div className="scroll-thin min-h-0 flex-1 overflow-y-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-medium tracking-tight">Plugins</h1>
        <p className="mt-1 text-sm text-muted">
          The same 22 plugins from StickAI. {enabled.length > 0 ? `${enabled.length} connected.` : "Connect the ones you want in chat."}
        </p>
        <div className="mt-5 flex items-center gap-2 rounded-full border border-line px-4">
          <Search className="size-4 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search plugins"
            aria-label="Search plugins"
            className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-faint"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Plugin categories">
          {PLUGIN_CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={category === item}
              onClick={() => setCategory(item)}
              className={
                category === item
                  ? "rounded-full bg-accent px-3 py-1.5 text-sm text-accent-fg"
                  : "rounded-full px-3 py-1.5 text-sm text-muted hover:bg-hover"
              }
            >
              {item}
            </button>
          ))}
        </div>
        {list.length === 0 ? (
          <p className="mt-16 text-center text-sm text-muted">No plugins match “{query}”.</p>
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {list.map((plugin) => {
              const on = enabled.includes(plugin.id);
              return (
                <div key={plugin.id} className="flex items-center gap-3 rounded-3xl border border-line p-3">
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    aria-label={`${plugin.name} details`}
                    onClick={() => setOpen(plugin)}
                  >
                    <Logo plugin={plugin} />
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{plugin.name}</span>
                      <span className="block truncate text-sm text-muted">
                        {plugin.tagline}
                        {plugin.account ? "" : " · Preview"}
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={on}
                    className={
                      on
                        ? "shrink-0 rounded-full border border-line px-4 py-1.5 text-sm"
                        : "shrink-0 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-fg"
                    }
                    onClick={() => connect(plugin, !on)}
                  >
                    {on ? "Connected" : "Connect"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <button className="scrim absolute inset-0" aria-label="Close" onClick={() => setOpen(null)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="plugin-title"
            className="shadow-pop relative z-10 max-h-[min(640px,90dvh)] w-full max-w-lg overflow-y-auto rounded-3xl border border-line bg-elevated p-5"
          >
            <button
              type="button"
              className="absolute right-3 top-3 grid size-9 place-items-center rounded-full hover:bg-hover"
              aria-label="Close"
              onClick={() => setOpen(null)}
            >
              <X className="size-4" />
            </button>
            <div className="flex items-center gap-3 pr-8">
              <Logo plugin={open} />
              <div>
                <h2 id="plugin-title" className="text-lg font-medium">
                  {open.name}
                </h2>
                <p className="text-sm text-muted">{open.tagline}</p>
              </div>
            </div>
            <p className="mt-4 text-sm">{open.description}</p>
            <p className="mt-2 text-xs text-muted">
              {open.account
                ? "In the original StickAI app this plugin can sign in to a real account. Here it stays in preview until that server is connected."
                : "Preview only: a live connection for this plugin isn't available yet."}
            </p>
            <h3 className="mb-2 mt-4 text-xs font-medium text-muted">Try asking</h3>
            <ul className="space-y-1.5">
              {open.examples.map((example) => (
                <li key={example}>
                  <button
                    type="button"
                    className="w-full rounded-xl bg-hover px-3 py-2 text-left text-sm hover:bg-canvas"
                    onClick={() => startWith(open, example)}
                  >
                    “{example}”
                  </button>
                </li>
              ))}
            </ul>
            <h3 className="mb-2 mt-4 text-xs font-medium text-muted">What Stick can do with it</h3>
            <ul className="space-y-1 text-sm">
              {open.tools.map((tool) => (
                <li key={tool} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0" />
                  {tool}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                className={
                  enabled.includes(open.id)
                    ? "h-10 flex-1 rounded-full border border-line text-sm"
                    : "h-10 flex-1 rounded-full bg-accent text-sm font-medium text-accent-fg"
                }
                onClick={() => connect(open, !enabled.includes(open.id))}
              >
                {enabled.includes(open.id) ? "Disconnect" : "Connect"}
              </button>
              <button
                type="button"
                className="h-10 flex-1 rounded-full bg-accent text-sm font-medium text-accent-fg"
                onClick={() => startWith(open, open.examples[0] ?? "")}
              >
                Start a chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
