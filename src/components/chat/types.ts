export type ModelId = "stick" | "stick-1" | "stick-1-1" | "stick-2" | "stick-2-1" | "stick-build";

export type ToolMode = "image" | "thinking" | "research" | "search";

export type ThemeChoice = "system" | "light" | "dark";

export type Attachment = {
  id: string;
  name: string;
  kind: "image" | "file";
  dataUrl?: string;
  text?: string;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  error?: string;
  attachments?: Attachment[];
  feedback?: "up" | "down";
  createdAt: number;
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
};

export type LocalUser = {
  name: string;
  email: string;
  method: string;
};

export type ViewId = "chat" | "images" | "plugins" | "pricing";

export const MODELS: { id: ModelId; label: string; blurb: string }[] = [
  { id: "stick", label: "Stick", blurb: "Fast · Basic everyday help and short answers" },
  { id: "stick-1", label: "Stick 1", blurb: "Everyday · General questions, explanations and conversation" },
  { id: "stick-1-1", label: "Stick 1.1", blurb: "Improved accuracy · Facts, uncertainty and research" },
  { id: "stick-2", label: "Stick 2", blurb: "Advanced · Reasoning, mathematics, programming and complex tasks" },
  { id: "stick-2-1", label: "Stick 2.1", blurb: "Multimodal · Image understanding and advanced analysis" },
  { id: "stick-build", label: "Stick Build", blurb: "Builder · Complete code, websites, applications and documents" },
];

const LEGACY_MODELS: Record<string, ModelId> = {
  instant: "stick",
  thinking: "stick-2",
  pro: "stick-2-1",
};

export function normalizeModel(value: unknown): ModelId {
  if (typeof value === "string" && MODELS.some((model) => model.id === value)) return value as ModelId;
  if (typeof value === "string" && LEGACY_MODELS[value]) return LEGACY_MODELS[value];
  return "stick-1";
}

export const HEADLINES = [
  "What are you working on?",
  "Where should we begin?",
  "What can I help with?",
  "What's on the agenda today?",
];
