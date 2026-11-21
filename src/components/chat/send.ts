import { activeChat, useChat, userMessageCount } from "./store";
import type { Attachment, Message } from "./types";

const SESSION_CAP = 30;
let controller: AbortController | null = null;
let raf = 0;
let pending = "";
let pendingTarget: { chatId: string; messageId: string } | null = null;

function flushPending() {
  if (!pending || !pendingTarget) return;
  const chunk = pending;
  const target = pendingTarget;
  pending = "";
  useChat.getState().appendToMessage(target.chatId, target.messageId, chunk);
}

function queueDelta(chatId: string, messageId: string, delta: string) {
  if (!pendingTarget || pendingTarget.chatId !== chatId || pendingTarget.messageId !== messageId) {
    flushPending();
    pendingTarget = { chatId, messageId };
  }
  pending += delta;
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    flushPending();
  });
}

export function stopGeneration() {
  controller?.abort();
}

function historyPayload(messages: Message[]) {
  return messages
    .filter((message) => message.content.trim() || message.attachments?.length || message.imageUrl)
    .slice(-16)
    .map((message) => {
      if (message.role === "assistant") {
        const text = message.imageUrl
          ? `${message.content}\n\n[Image created]`
          : message.content;
        return { role: message.role, content: text };
      }
      const note = message.attachments
        ?.map((file) => (file.text ? `\n\nAttached file ${file.name}:\n${file.text}` : `\n\nAttached ${file.kind}: ${file.name}`))
        .join("");
      const text = `${message.content}${note ?? ""}`.trim();
      const images = (message.attachments ?? []).filter((file) => file.kind === "image" && file.dataUrl);
      if (!images.length) return { role: message.role, content: text || " " };
      return {
        role: message.role,
        content: [
          ...(text ? [{ type: "text" as const, text }] : []),
          ...images.map((file) => ({
            type: "image_url" as const,
            image_url: { url: file.dataUrl as string },
          })),
        ],
      };
    });
}

async function readError(response: Response) {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error || "Something went wrong.";
  } catch {
    return "Something went wrong.";
  }
}

export async function runTurn(options?: { regenerateFrom?: string }) {
  const store = useChat.getState();
  if (store.status === "streaming") return;
  const chat = activeChat(store);
  if (!chat) return;

  let source = chat.messages;
  if (options?.regenerateFrom) {
    const index = source.findIndex((message) => message.id === options.regenerateFrom);
    if (index < 0) return;
    source = source.slice(0, index);
    store.truncateAfter(chat.id, source[source.length - 1]?.id ?? options.regenerateFrom);
    if (source[source.length - 1]?.role === "assistant") {
      const keepUntil = source[source.length - 2];
      if (!keepUntil) return;
      source = source.slice(0, -1);
      store.truncateAfter(chat.id, keepUntil.id);
    }
  }

  const latest = useChat.getState();
  const fresh = latest.chats.find((item) => item.id === chat.id);
  if (!fresh) return;
  const history = options?.regenerateFrom ? fresh.messages : source;

  const assistantId = crypto.randomUUID();
  const placeholder: Message = {
    id: assistantId,
    role: "assistant",
    content: "",
    createdAt: Date.now(),
  };
  latest.addMessage(chat.id, placeholder);
  latest.setStatus("streaming");

  const mode = latest.mode;
  const lastUser = [...history].reverse().find((message) => message.role === "user");
  controller = new AbortController();

  try {
    if (mode === "image" && lastUser) {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ prompt: lastUser.content }),
      });
      if (!response.ok) throw new Error(await readError(response));
      const data = (await response.json()) as { url?: string };
      if (!data.url) throw new Error("The image could not be created.");
      useChat.getState().updateMessage(chat.id, assistantId, {
        content: "Here's the image.",
        imageUrl: data.url,
      });
      return;
    }

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: latest.model,
        mode: mode === "image" ? null : mode,
        instructions: latest.instructions,
        plugins: latest.plugins,
        messages: historyPayload(history),
      }),
    });
    if (!response.ok || !response.body) throw new Error(await readError(response));
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let saw = false;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const delta = decoder.decode(value, { stream: true });
      if (!delta) continue;
      saw = true;
      queueDelta(chat.id, assistantId, delta);
    }
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    flushPending();
    if (!saw) {
      useChat.getState().updateMessage(chat.id, assistantId, {
        error: "The assistant returned an empty reply.",
      });
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      flushPending();
      const current = useChat
        .getState()
        .chats.find((item) => item.id === chat.id)
        ?.messages.find((message) => message.id === assistantId);
      if (current && !current.content && !current.imageUrl) {
        useChat.getState().updateMessage(chat.id, assistantId, { content: "Stopped." });
      }
      return;
    }
    const message = error instanceof Error ? error.message : "Something went wrong.";
    useChat.getState().updateMessage(chat.id, assistantId, { error: message });
  } finally {
    controller = null;
    useChat.getState().setStatus("idle");
    useChat.getState().save();
  }
}

export async function sendComposer(text: string, attachments: Attachment[]) {
  const trimmed = text.trim();
  if (!trimmed && attachments.length === 0) return false;
  const store = useChat.getState();
  if (store.status === "streaming") return false;
  if (userMessageCount(store.chats) >= SESSION_CAP) {
    return "limit" as const;
  }
  const titleBase = trimmed || attachments[0]?.name || "New chat";
  const chatId = store.ensureChat(titleBase);
  const userMessage: Message = {
    id: crypto.randomUUID(),
    role: "user",
    content: trimmed,
    attachments,
    createdAt: Date.now(),
  };
  useChat.getState().addMessage(chatId, userMessage);
  const chats = useChat.getState().chats.map((chat) =>
    chat.id === chatId && chat.title === "New chat" ? { ...chat, title: titleBase.slice(0, 48) } : chat,
  );
  useChat.setState({ chats });
  await runTurn();
  return true;
}

export async function regenerate(messageId: string) {
  await runTurn({ regenerateFrom: messageId });
}

export async function editAndResend(messageId: string, content: string) {
  const store = useChat.getState();
  const chat = activeChat(store);
  if (!chat || store.status === "streaming") return;
  store.updateMessage(chat.id, messageId, { content });
  store.truncateAfter(chat.id, messageId);
  await runTurn();
}
