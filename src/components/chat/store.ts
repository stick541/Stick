import { create } from "zustand";
import { PLUGINS } from "./plugins";
import type {
  Chat,
  LocalUser,
  Message,
  ModelId,
  ThemeChoice,
  ToolMode,
  ViewId,
} from "./types";
import { normalizeModel } from "./types";

const KEY = "cgpt-state";

type Persisted = {
  theme: ThemeChoice;
  chats: Chat[];
  activeId: string | null;
  user: LocalUser | null;
  instructions: string;
  model: ModelId;
  improve: boolean;
  plugins: string[];
};

type State = Persisted & {
  hydrated: boolean;
  activeId: string | null;
  view: ViewId;
  mode: ToolMode | null;
  collapsed: boolean;
  mobileOpen: boolean;
  loginOpen: boolean;
  settingsOpen: boolean;
  helpOpen: boolean;
  searchOpen: boolean;
  voiceOpen: boolean;
  legalOpen: boolean;
  status: "idle" | "streaming";
  seed: string;
  hydrate: () => void;
  save: () => void;
  setTheme: (theme: ThemeChoice) => void;
  applyTheme: (theme?: ThemeChoice) => void;
  signIn: (user: LocalUser) => void;
  signOut: () => void;
  setInstructions: (instructions: string) => void;
  setImprove: (improve: boolean) => void;
  setModel: (model: ModelId) => void;
  setPlugin: (id: string, on: boolean) => void;
  setMode: (mode: ToolMode | null) => void;
  setView: (view: ViewId) => void;
  setCollapsed: (collapsed: boolean) => void;
  setMobileOpen: (open: boolean) => void;
  setLoginOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setHelpOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setVoiceOpen: (open: boolean) => void;
  setLegalOpen: (open: boolean) => void;
  setStatus: (status: "idle" | "streaming") => void;
  setSeed: (seed: string) => void;
  newChat: () => void;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => void;
  renameChat: (id: string, title: string) => void;
  togglePin: (id: string) => void;
  deleteAll: () => void;
  ensureChat: (title: string) => string;
  addMessage: (chatId: string, message: Message) => void;
  updateMessage: (chatId: string, messageId: string, patch: Partial<Message>) => void;
  appendToMessage: (chatId: string, messageId: string, chunk: string) => void;
  truncateAfter: (chatId: string, messageId: string) => void;
  setFeedback: (chatId: string, messageId: string, feedback: "up" | "down") => void;
};

function stripForStorage(chats: Chat[]): Chat[] {
  return chats.slice(0, 40).map((chat) => ({
    ...chat,
    messages: chat.messages.map((message) => ({
      ...message,
      attachments: message.attachments?.map((file) => ({
        id: file.id,
        name: file.name,
        kind: file.kind,
        text: file.text?.slice(0, 4000),
      })),
    })),
  }));
}

function load(): Partial<Persisted> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const data = JSON.parse(raw) as Partial<Persisted>;
    if (data.chats && !Array.isArray(data.chats)) return {};
    return {
      theme: data.theme ?? "system",
      chats: Array.isArray(data.chats) ? data.chats : [],
      activeId: typeof data.activeId === "string" ? data.activeId : null,
      user: data.user ?? null,
      instructions: typeof data.instructions === "string" ? data.instructions : "",
      model: normalizeModel(data.model),
      improve: data.improve !== false,
      plugins: Array.isArray(data.plugins)
        ? data.plugins.filter((id): id is string => typeof id === "string" && PLUGINS.some((plugin) => plugin.id === id))
        : [],
    };
  } catch {
    return {};
  }
}

let saveTimer: number | null = null;

function scheduleSave() {
  if (typeof window === "undefined") return;
  if (saveTimer) window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    useChat.getState().save();
    saveTimer = null;
  }, 350);
}

export const useChat = create<State>((set, get) => ({
  hydrated: false,
  theme: "system",
  chats: [],
  user: null,
  instructions: "",
  model: "stick-1",
  improve: true,
  plugins: [],
  activeId: null,
  view: "chat",
  mode: null,
  collapsed: false,
  mobileOpen: false,
  loginOpen: false,
  settingsOpen: false,
  helpOpen: false,
  searchOpen: false,
  voiceOpen: false,
  legalOpen: false,
  status: "idle",
  seed: "",

  hydrate: () => {
    if (get().hydrated) return;
    const data = load();
    const chats = data.chats ?? [];
    const activeId = chats.some((chat) => chat.id === data.activeId) ? (data.activeId ?? null) : null;
    set({
      theme: data.theme ?? "system",
      chats,
      activeId,
      user: data.user ?? null,
      instructions: data.instructions ?? "",
      model: normalizeModel(data.model),
      improve: data.improve !== false,
      plugins: data.plugins ?? [],
      hydrated: true,
    });
    get().applyTheme(data.theme ?? "system");
  },

  save: () => {
    if (!get().hydrated || typeof window === "undefined") return;
    const { theme, chats, activeId, user, instructions, model, improve, plugins } = get();
    const payload: Persisted = {
      theme,
      chats: stripForStorage(chats),
      activeId,
      user,
      instructions,
      model,
      improve,
      plugins,
    };
    try {
      localStorage.setItem(KEY, JSON.stringify(payload));
    } catch {
      /* quota */
    }
  },

  applyTheme: (theme) => {
    const choice = theme ?? get().theme;
    const dark =
      choice === "dark" ||
      (choice !== "light" &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  },

  setTheme: (theme) => {
    set({ theme });
    get().applyTheme(theme);
    get().save();
  },
  signIn: (user) => {
    set({ user, loginOpen: false });
    get().save();
  },
  signOut: () => {
    set({ user: null });
    get().save();
  },
  setInstructions: (instructions) => {
    set({ instructions });
    get().save();
  },
  setImprove: (improve) => {
    set({ improve });
    get().save();
  },
  setModel: (model) => {
    set({ model });
    get().save();
  },
  setPlugin: (id, on) => {
    if (!PLUGINS.some((plugin) => plugin.id === id)) return;
    set({
      plugins: on ? (get().plugins.includes(id) ? get().plugins : [...get().plugins, id]) : get().plugins.filter((item) => item !== id),
    });
    get().save();
  },
  setMode: (mode) => set({ mode }),
  setView: (view) => set({ view, mobileOpen: false }),
  setCollapsed: (collapsed) => set({ collapsed }),
  setMobileOpen: (mobileOpen) => set({ mobileOpen }),
  setLoginOpen: (loginOpen) => set({ loginOpen }),
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
  setHelpOpen: (helpOpen) => set({ helpOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setVoiceOpen: (voiceOpen) => set({ voiceOpen }),
  setLegalOpen: (legalOpen) => set({ legalOpen }),
  setStatus: (status) => set({ status }),
  setSeed: (seed) => set({ seed }),

  newChat: () => {
    set({ activeId: null, view: "chat", mobileOpen: false, mode: null });
    get().save();
  },

  selectChat: (id) => {
    set({ activeId: id, view: "chat", mobileOpen: false, searchOpen: false });
    get().save();
  },

  deleteChat: (id) => {
    set({
      chats: get().chats.filter((chat) => chat.id !== id),
      activeId: get().activeId === id ? null : get().activeId,
    });
    get().save();
  },

  renameChat: (id, title) => {
    const next = title.trim().slice(0, 80);
    if (!next) return;
    set({
      chats: get().chats.map((chat) => (chat.id === id ? { ...chat, title: next, updatedAt: Date.now() } : chat)),
    });
    get().save();
  },

  togglePin: (id) => {
    set({
      chats: get().chats.map((chat) => (chat.id === id ? { ...chat, pinned: !chat.pinned } : chat)),
    });
    get().save();
  },

  deleteAll: () => {
    set({ chats: [], activeId: null });
    get().save();
  },

  ensureChat: (title) => {
    const current = get().activeId;
    if (current && get().chats.some((chat) => chat.id === current)) return current;
    const id = crypto.randomUUID();
    const now = Date.now();
    const chat: Chat = {
      id,
      title: title.slice(0, 48) || "New chat",
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    set({ chats: [chat, ...get().chats], activeId: id });
    return id;
  },

  addMessage: (chatId, message) => {
    set({
      chats: get().chats.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, message], updatedAt: Date.now() }
          : chat,
      ),
    });
    scheduleSave();
  },

  updateMessage: (chatId, messageId, patch) => {
    set({
      chats: get().chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              updatedAt: Date.now(),
              messages: chat.messages.map((message) =>
                message.id === messageId ? { ...message, ...patch } : message,
              ),
            }
          : chat,
      ),
    });
    scheduleSave();
  },

  appendToMessage: (chatId, messageId, chunk) => {
    set({
      chats: get().chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: chat.messages.map((message) =>
                message.id === messageId
                  ? { ...message, content: message.content + chunk }
                  : message,
              ),
            }
          : chat,
      ),
    });
    scheduleSave();
  },

  truncateAfter: (chatId, messageId) => {
    set({
      chats: get().chats.map((chat) => {
        if (chat.id !== chatId) return chat;
        const index = chat.messages.findIndex((message) => message.id === messageId);
        if (index < 0) return chat;
        return { ...chat, messages: chat.messages.slice(0, index + 1), updatedAt: Date.now() };
      }),
    });
    scheduleSave();
  },

  setFeedback: (chatId, messageId, feedback) => {
    const chat = get().chats.find((item) => item.id === chatId);
    const current = chat?.messages.find((message) => message.id === messageId);
    get().updateMessage(chatId, messageId, {
      feedback: current?.feedback === feedback ? undefined : feedback,
    });
  },
}));

export function activeChat(state: State): Chat | null {
  return state.chats.find((chat) => chat.id === state.activeId) ?? null;
}

export function userMessageCount(chats: Chat[]) {
  return chats.reduce(
    (total, chat) => total + chat.messages.filter((message) => message.role === "user").length,
    0,
  );
}
