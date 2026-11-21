import { useEffect } from "react";
import { Menu, PanelLeft, Share } from "lucide-react";
import { Toaster, toast } from "sonner";
import { stopGeneration } from "./send";
import { Sidebar } from "./sidebar";
import { ChatStage, ModelMenu } from "./stage";
import { activeChat, useChat } from "./store";
import { HelpModal, ImagesView, LegalModal, LoginModal, PricingView, SearchModal, SettingsModal, VoiceOverlay } from "./overlays";
import { PluginsView } from "./plugins-view";

export function ChatApp() {
  const hydrate = useChat((s) => s.hydrate);
  const hydrated = useChat((s) => s.hydrated);
  const view = useChat((s) => s.view);
  const user = useChat((s) => s.user);
  const collapsed = useChat((s) => s.collapsed);
  const theme = useChat((s) => s.theme);
  const setLoginOpen = useChat((s) => s.setLoginOpen);
  const setMobileOpen = useChat((s) => s.setMobileOpen);
  const setCollapsed = useChat((s) => s.setCollapsed);
  const setView = useChat((s) => s.setView);
  const chat = useChat((s) => activeChat(s));
  const loginOpen = useChat((s) => s.loginOpen);
  const settingsOpen = useChat((s) => s.settingsOpen);
  const helpOpen = useChat((s) => s.helpOpen);
  const searchOpen = useChat((s) => s.searchOpen);
  const voiceOpen = useChat((s) => s.voiceOpen);
  const legalOpen = useChat((s) => s.legalOpen);

  useEffect(() => {
    hydrate();
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onTheme = () => {
      if (useChat.getState().theme === "system") useChat.getState().applyTheme("system");
    };
    media.addEventListener("change", onTheme);
    const flush = () => useChat.getState().save();
    window.addEventListener("beforeunload", flush);
    return () => {
      media.removeEventListener("change", onTheme);
      window.removeEventListener("beforeunload", flush);
    };
  }, [hydrate]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;
      if (meta && event.key.toLowerCase() === "k") {
        event.preventDefault();
        useChat.getState().setSearchOpen(true);
      }
      if (meta && event.shiftKey && event.key.toLowerCase() === "o") {
        event.preventDefault();
        stopGeneration();
        useChat.getState().newChat();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.title = chat && view === "chat" ? `${chat.title} - Stick AI` : "Stick AI";
  }, [chat, view]);

  const resolvedTheme =
    theme === "dark" || (theme === "system" && typeof document !== "undefined" && document.documentElement.dataset.theme === "dark")
      ? "dark"
      : "light";

  return (
    <div className="flex h-dvh bg-canvas text-fg">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-1 px-2 sm:px-3">
          <button
            type="button"
            className="grid size-10 place-items-center rounded-xl hover:bg-hover lg:hidden"
            aria-label="Open sidebar"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          {collapsed && (
            <button
              type="button"
              className="hidden size-10 place-items-center rounded-xl hover:bg-hover lg:grid"
              aria-label="Open sidebar"
              onClick={() => setCollapsed(false)}
            >
              <PanelLeft className="size-5" />
            </button>
          )}
          <ModelMenu align="left" />
          <div className="flex-1" />
          {chat && chat.messages.length > 0 && view === "chat" && (
            <button
              type="button"
              aria-label="Share chat"
              className="grid size-10 place-items-center rounded-xl hover:bg-hover"
              onClick={() => {
                const text = chat.messages.map((message) => `${message.role === "user" ? "You" : "Stick AI"}: ${message.content}`).join("\n\n");
                void navigator.clipboard.writeText(text).then(() => toast("Conversation copied"));
              }}
            >
              <Share className="size-4" />
            </button>
          )}
          {!hydrated ? (
            <span className="h-9 w-28" />
          ) : user ? (
            <button type="button" className="h-9 rounded-full border border-line px-3 text-sm" onClick={() => setView("pricing")}>
              Upgrade
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button type="button" className="btn-login h-9 rounded-full px-3 text-sm font-medium" onClick={() => setLoginOpen(true)}>
                Log in
              </button>
              <button type="button" className="btn-signup h-9 rounded-full px-3 text-sm font-medium" onClick={() => setLoginOpen(true)}>
                <span className="sm:hidden">Sign up</span>
                <span className="hidden sm:inline">Sign up for free</span>
              </button>
            </div>
          )}
        </header>
        {view === "chat" && <ChatStage />}
        {view === "images" && <ImagesView />}
        {view === "plugins" && <PluginsView />}
        {view === "pricing" && <PricingView />}
      </div>
      {loginOpen && <LoginModal />}
      {settingsOpen && <SettingsModal />}
      {helpOpen && <HelpModal />}
      {searchOpen && <SearchModal />}
      {legalOpen && <LegalModal />}
      {voiceOpen && <VoiceOverlay />}
      <Toaster theme={resolvedTheme} position="top-center" />
    </div>
  );
}
