import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as Copy, C as PanelLeft, D as Image, E as Lightbulb, F as ArrowUp, M as ChevronDown, N as Check, O as Globe, P as AudioLines, S as Paperclip, T as Menu, _ as Puzzle, b as PinOff, c as ThumbsDown, d as SquarePen, f as Smartphone, g as RefreshCw, h as Search, i as UserRound, j as CircleHelp, k as Ellipsis, l as Telescope, m as Settings, n as WalletCards, o as Trash2, p as Share, r as Volume2, s as ThumbsUp, t as X, u as Square, v as Plus, w as Mic, x as Pencil, y as Pin } from "../_libs/lucide-react.mjs";
import { a as PLUGINS, i as normalizeModel, n as HEADLINES, o as PLUGIN_CATEGORIES, r as MODELS } from "./router-CHxBGrnZ.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { a as DropdownMenuTrigger, i as DropdownMenuPortal, n as DropdownMenuContent, r as DropdownMenuItem, t as DropdownMenu } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DQ6a0mWY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY = "cgpt-state";
function stripForStorage(chats) {
	return chats.slice(0, 40).map((chat) => ({
		...chat,
		messages: chat.messages.map((message) => ({
			...message,
			attachments: message.attachments?.map((file) => ({
				id: file.id,
				name: file.name,
				kind: file.kind,
				text: file.text?.slice(0, 4e3)
			}))
		}))
	}));
}
function load() {
	if (typeof window === "undefined") return {};
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return {};
		const data = JSON.parse(raw);
		if (data.chats && !Array.isArray(data.chats)) return {};
		return {
			theme: data.theme ?? "system",
			chats: Array.isArray(data.chats) ? data.chats : [],
			activeId: typeof data.activeId === "string" ? data.activeId : null,
			user: data.user ?? null,
			instructions: typeof data.instructions === "string" ? data.instructions : "",
			model: normalizeModel(data.model),
			improve: data.improve !== false,
			plugins: Array.isArray(data.plugins) ? data.plugins.filter((id) => typeof id === "string" && PLUGINS.some((plugin) => plugin.id === id)) : []
		};
	} catch {
		return {};
	}
}
var saveTimer = null;
function scheduleSave() {
	if (typeof window === "undefined") return;
	if (saveTimer) window.clearTimeout(saveTimer);
	saveTimer = window.setTimeout(() => {
		useChat.getState().save();
		saveTimer = null;
	}, 350);
}
var useChat = create((set, get) => ({
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
		const activeId = chats.some((chat) => chat.id === data.activeId) ? data.activeId ?? null : null;
		set({
			theme: data.theme ?? "system",
			chats,
			activeId,
			user: data.user ?? null,
			instructions: data.instructions ?? "",
			model: normalizeModel(data.model),
			improve: data.improve !== false,
			plugins: data.plugins ?? [],
			hydrated: true
		});
		get().applyTheme(data.theme ?? "system");
	},
	save: () => {
		if (!get().hydrated || typeof window === "undefined") return;
		const { theme, chats, activeId, user, instructions, model, improve, plugins } = get();
		const payload = {
			theme,
			chats: stripForStorage(chats),
			activeId,
			user,
			instructions,
			model,
			improve,
			plugins
		};
		try {
			localStorage.setItem(KEY, JSON.stringify(payload));
		} catch {}
	},
	applyTheme: (theme) => {
		const choice = theme ?? get().theme;
		const dark = choice === "dark" || choice !== "light" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
		document.documentElement.dataset.theme = dark ? "dark" : "light";
	},
	setTheme: (theme) => {
		set({ theme });
		get().applyTheme(theme);
		get().save();
	},
	signIn: (user) => {
		set({
			user,
			loginOpen: false
		});
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
		set({ plugins: on ? get().plugins.includes(id) ? get().plugins : [...get().plugins, id] : get().plugins.filter((item) => item !== id) });
		get().save();
	},
	setMode: (mode) => set({ mode }),
	setView: (view) => set({
		view,
		mobileOpen: false
	}),
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
		set({
			activeId: null,
			view: "chat",
			mobileOpen: false,
			mode: null
		});
		get().save();
	},
	selectChat: (id) => {
		set({
			activeId: id,
			view: "chat",
			mobileOpen: false,
			searchOpen: false
		});
		get().save();
	},
	deleteChat: (id) => {
		set({
			chats: get().chats.filter((chat) => chat.id !== id),
			activeId: get().activeId === id ? null : get().activeId
		});
		get().save();
	},
	renameChat: (id, title) => {
		const next = title.trim().slice(0, 80);
		if (!next) return;
		set({ chats: get().chats.map((chat) => chat.id === id ? {
			...chat,
			title: next,
			updatedAt: Date.now()
		} : chat) });
		get().save();
	},
	togglePin: (id) => {
		set({ chats: get().chats.map((chat) => chat.id === id ? {
			...chat,
			pinned: !chat.pinned
		} : chat) });
		get().save();
	},
	deleteAll: () => {
		set({
			chats: [],
			activeId: null
		});
		get().save();
	},
	ensureChat: (title) => {
		const current = get().activeId;
		if (current && get().chats.some((chat) => chat.id === current)) return current;
		const id = crypto.randomUUID();
		const now = Date.now();
		set({
			chats: [{
				id,
				title: title.slice(0, 48) || "New chat",
				messages: [],
				createdAt: now,
				updatedAt: now
			}, ...get().chats],
			activeId: id
		});
		return id;
	},
	addMessage: (chatId, message) => {
		set({ chats: get().chats.map((chat) => chat.id === chatId ? {
			...chat,
			messages: [...chat.messages, message],
			updatedAt: Date.now()
		} : chat) });
		scheduleSave();
	},
	updateMessage: (chatId, messageId, patch) => {
		set({ chats: get().chats.map((chat) => chat.id === chatId ? {
			...chat,
			updatedAt: Date.now(),
			messages: chat.messages.map((message) => message.id === messageId ? {
				...message,
				...patch
			} : message)
		} : chat) });
		scheduleSave();
	},
	appendToMessage: (chatId, messageId, chunk) => {
		set({ chats: get().chats.map((chat) => chat.id === chatId ? {
			...chat,
			messages: chat.messages.map((message) => message.id === messageId ? {
				...message,
				content: message.content + chunk
			} : message)
		} : chat) });
		scheduleSave();
	},
	truncateAfter: (chatId, messageId) => {
		set({ chats: get().chats.map((chat) => {
			if (chat.id !== chatId) return chat;
			const index = chat.messages.findIndex((message) => message.id === messageId);
			if (index < 0) return chat;
			return {
				...chat,
				messages: chat.messages.slice(0, index + 1),
				updatedAt: Date.now()
			};
		}) });
		scheduleSave();
	},
	setFeedback: (chatId, messageId, feedback) => {
		const current = get().chats.find((item) => item.id === chatId)?.messages.find((message) => message.id === messageId);
		get().updateMessage(chatId, messageId, { feedback: current?.feedback === feedback ? void 0 : feedback });
	}
}));
function activeChat(state) {
	return state.chats.find((chat) => chat.id === state.activeId) ?? null;
}
function userMessageCount(chats) {
	return chats.reduce((total, chat) => total + chat.messages.filter((message) => message.role === "user").length, 0);
}
var SESSION_CAP = 30;
var controller = null;
var raf = 0;
var pending = "";
var pendingTarget = null;
function flushPending() {
	if (!pending || !pendingTarget) return;
	const chunk = pending;
	const target = pendingTarget;
	pending = "";
	useChat.getState().appendToMessage(target.chatId, target.messageId, chunk);
}
function queueDelta(chatId, messageId, delta) {
	if (!pendingTarget || pendingTarget.chatId !== chatId || pendingTarget.messageId !== messageId) {
		flushPending();
		pendingTarget = {
			chatId,
			messageId
		};
	}
	pending += delta;
	if (raf) return;
	raf = requestAnimationFrame(() => {
		raf = 0;
		flushPending();
	});
}
function stopGeneration() {
	controller?.abort();
}
function historyPayload(messages) {
	return messages.filter((message) => message.content.trim() || message.attachments?.length || message.imageUrl).slice(-16).map((message) => {
		if (message.role === "assistant") {
			const text = message.imageUrl ? `${message.content}\n\n[Image created]` : message.content;
			return {
				role: message.role,
				content: text
			};
		}
		const note = message.attachments?.map((file) => file.text ? `\n\nAttached file ${file.name}:\n${file.text}` : `\n\nAttached ${file.kind}: ${file.name}`).join("");
		const text = `${message.content}${note ?? ""}`.trim();
		const images = (message.attachments ?? []).filter((file) => file.kind === "image" && file.dataUrl);
		if (!images.length) return {
			role: message.role,
			content: text || " "
		};
		return {
			role: message.role,
			content: [...text ? [{
				type: "text",
				text
			}] : [], ...images.map((file) => ({
				type: "image_url",
				image_url: { url: file.dataUrl }
			}))]
		};
	});
}
async function readError(response) {
	try {
		return (await response.json()).error || "Something went wrong.";
	} catch {
		return "Something went wrong.";
	}
}
async function runTurn(options) {
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
	const placeholder = {
		id: assistantId,
		role: "assistant",
		content: "",
		createdAt: Date.now()
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
				body: JSON.stringify({ prompt: lastUser.content })
			});
			if (!response.ok) throw new Error(await readError(response));
			const data = await response.json();
			if (!data.url) throw new Error("The image could not be created.");
			useChat.getState().updateMessage(chat.id, assistantId, {
				content: "Here's the image.",
				imageUrl: data.url
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
				messages: historyPayload(history)
			})
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
		if (!saw) useChat.getState().updateMessage(chat.id, assistantId, { error: "The assistant returned an empty reply." });
	} catch (error) {
		if (error instanceof DOMException && error.name === "AbortError") {
			if (raf) cancelAnimationFrame(raf);
			raf = 0;
			flushPending();
			const current = useChat.getState().chats.find((item) => item.id === chat.id)?.messages.find((message) => message.id === assistantId);
			if (current && !current.content && !current.imageUrl) useChat.getState().updateMessage(chat.id, assistantId, { content: "Stopped." });
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
async function sendComposer(text, attachments) {
	const trimmed = text.trim();
	if (!trimmed && attachments.length === 0) return false;
	const store = useChat.getState();
	if (store.status === "streaming") return false;
	if (userMessageCount(store.chats) >= SESSION_CAP) return "limit";
	const titleBase = trimmed || attachments[0]?.name || "New chat";
	const chatId = store.ensureChat(titleBase);
	const userMessage = {
		id: crypto.randomUUID(),
		role: "user",
		content: trimmed,
		attachments,
		createdAt: Date.now()
	};
	useChat.getState().addMessage(chatId, userMessage);
	const chats = useChat.getState().chats.map((chat) => chat.id === chatId && chat.title === "New chat" ? {
		...chat,
		title: titleBase.slice(0, 48)
	} : chat);
	useChat.setState({ chats });
	await runTurn();
	return true;
}
async function regenerate(messageId) {
	await runTurn({ regenerateFrom: messageId });
}
async function editAndResend(messageId, content) {
	const store = useChat.getState();
	const chat = activeChat(store);
	if (!chat || store.status === "streaming") return;
	store.updateMessage(chat.id, messageId, { content });
	store.truncateAfter(chat.id, messageId);
	await runTurn();
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Logo$1({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/stick-logo.png",
		alt: "",
		className: cn("size-7 rounded-lg object-cover", className)
	});
}
function GoogleMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className: "size-5",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				d: "M21.6 12.23c0-.74-.07-1.45-.2-2.13H12v4.03h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.32 2.98-7.42Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				opacity: "0.7",
				d: "M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.58A10 10 0 0 0 12 22Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				opacity: "0.5",
				d: "M6.41 13.91A6 6 0 0 1 6.1 12c0-.66.11-1.3.31-1.91V7.51H3.06A10 10 0 0 0 2 12c0 1.61.39 3.14 1.06 4.49l3.35-2.58Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				opacity: "0.85",
				d: "M12 5.97c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.95 2.99 14.7 2 12 2A10 10 0 0 0 3.06 7.51l3.35 2.58C7.2 7.73 9.4 5.97 12 5.97Z"
			})
		]
	});
}
function MicrosoftMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		className: "size-4",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M3 3h8.2v8.2H3zM12.8 3H21v8.2h-8.2zM3 12.8h8.2V21H3zM12.8 12.8H21V21h-8.2z"
		})
	});
}
function AppleMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		className: "size-5",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.3 2.9 2.3 1.1 0 1.6-.7 3-.7s1.8.7 3 .7 2-.1 2.9-2.3c.7-1 1.2-2.1 1.5-3.2-3.9-1.5-3.8-5.4-1.8-6.1ZM14.7 6.6c.6-.8 1.1-1.9.9-3-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.8-.9 2.9 1 .1 2-.5 2.6-1.3Z"
		})
	});
}
function groupChats(chats) {
	const start = (time) => {
		const date = new Date(time);
		return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
	};
	const today = start(Date.now());
	const buckets = [
		{
			label: "Pinned",
			items: []
		},
		{
			label: "Today",
			items: []
		},
		{
			label: "Yesterday",
			items: []
		},
		{
			label: "Previous 7 days",
			items: []
		},
		{
			label: "Older",
			items: []
		}
	];
	for (const chat of [...chats].sort((a, b) => b.updatedAt - a.updatedAt)) {
		if (chat.pinned) {
			buckets[0].items.push(chat);
			continue;
		}
		const day = start(chat.updatedAt);
		if (day >= today) buckets[1].items.push(chat);
		else if (day >= today - 864e5) buckets[2].items.push(chat);
		else if (day >= today - 5184e5) buckets[3].items.push(chat);
		else buckets[4].items.push(chat);
	}
	return buckets.filter((bucket) => bucket.items.length);
}
function ChatRow({ chat, active, onPick }) {
	const renameChat = useChat((s) => s.renameChat);
	const togglePin = useChat((s) => s.togglePin);
	const deleteChat = useChat((s) => s.deleteChat);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [value, setValue] = (0, import_react.useState)(chat.title);
	const [open, setOpen] = (0, import_react.useState)(false);
	if (editing) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		autoFocus: true,
		value,
		"aria-label": "Rename chat",
		className: "h-9 w-full rounded-lg bg-hover px-2.5 text-sm outline-none ring-1 ring-fg",
		onChange: (event) => setValue(event.target.value),
		onBlur: () => {
			renameChat(chat.id, value.trim() || chat.title);
			setEditing(false);
		},
		onKeyDown: (event) => {
			if (event.key === "Enter") event.target.blur();
			if (event.key === "Escape") {
				setValue(chat.title);
				setEditing(false);
			}
		}
	});
	const itemClass = "flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm outline-none hover:bg-hover";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("group flex items-center rounded-lg", active ? "bg-hover" : "hover:bg-hover"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onPick,
			className: "h-9 min-w-0 flex-1 truncate px-2.5 text-left text-sm",
			children: chat.title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, {
			open,
			onOpenChange: setOpen,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
				"aria-label": `Options for ${chat.title}`,
				className: cn("mr-1 grid size-7 shrink-0 place-items-center rounded-md text-muted hover:bg-canvas hover:text-fg", "opacity-100 md:opacity-0 md:group-hover:opacity-100", open && "opacity-100"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
				align: "start",
				sideOffset: 4,
				className: "shadow-pop z-50 min-w-40 rounded-xl border border-line bg-elevated p-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
						className: itemClass,
						onSelect: () => togglePin(chat.id),
						children: [chat.pinned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "size-4" }), chat.pinned ? "Unpin" : "Pin"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
						className: itemClass,
						onSelect: () => {
							setValue(chat.title);
							setEditing(true);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" }), "Rename"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
						className: cn(itemClass, "text-danger"),
						onSelect: () => deleteChat(chat.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Delete"]
					})
				]
			}) })]
		})]
	});
}
function Sidebar() {
	const collapsed = useChat((s) => s.collapsed);
	const mobileOpen = useChat((s) => s.mobileOpen);
	const chats = useChat((s) => s.chats);
	const activeId = useChat((s) => s.activeId);
	const view = useChat((s) => s.view);
	const user = useChat((s) => s.user);
	const hydrated = useChat((s) => s.hydrated);
	const setMobileOpen = useChat((s) => s.setMobileOpen);
	const setCollapsed = useChat((s) => s.setCollapsed);
	const newChat = useChat((s) => s.newChat);
	const selectChat = useChat((s) => s.selectChat);
	const setView = useChat((s) => s.setView);
	const setMode = useChat((s) => s.setMode);
	const setLoginOpen = useChat((s) => s.setLoginOpen);
	const setSettingsOpen = useChat((s) => s.setSettingsOpen);
	const setHelpOpen = useChat((s) => s.setHelpOpen);
	const setSearchOpen = useChat((s) => s.setSearchOpen);
	const [menu, setMenu] = (0, import_react.useState)(false);
	const closeMobile = () => setMobileOpen(false);
	const hideLabel = collapsed ? "lg:hidden" : "";
	const itemClass = "flex h-10 w-full items-center gap-3 rounded-xl px-2.5 text-left text-sm hover:bg-hover";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: "scrim fixed inset-0 z-30 lg:hidden",
		"aria-label": "Close menu",
		onClick: closeMobile
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: cn("fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-fg transition-transform duration-200", mobileOpen ? "translate-x-0" : "-translate-x-full", "lg:static lg:translate-x-0", collapsed && "lg:w-16"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-14 items-center gap-2 px-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo$1, { className: "size-7 shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("truncate text-sm font-medium", hideLabel),
						children: "Stick AI"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "ml-auto grid size-10 place-items-center rounded-xl hover:bg-hover",
						"aria-label": collapsed ? "Expand sidebar" : "Collapse sidebar",
						onClick: () => {
							if (window.innerWidth < 1024) closeMobile();
							else setCollapsed(!collapsed);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeft, { className: "size-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "scroll-thin flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-2",
				"aria-label": "Primary",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: itemClass,
						onClick: () => {
							newChat();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "size-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: hideLabel,
							children: "New chat"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: itemClass,
						onClick: () => setSearchOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: hideLabel,
							children: "Search chats"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: cn(itemClass, view === "images" && "bg-hover"),
						onClick: () => setView("images"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: hideLabel,
							children: "Images"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: cn(itemClass, view === "plugins" && "bg-hover"),
						onClick: () => setView("plugins"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Puzzle, { className: "size-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: hideLabel,
							children: "Plugins"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: itemClass,
						onClick: () => {
							setMode("research");
							setView("chat");
							newChat();
							setMode("research");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Telescope, { className: "size-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: hideLabel,
							children: "Deep research"
						})]
					}),
					hydrated && chats.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("mt-3", hideLabel),
						children: groupChats(chats).map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-2.5 py-1 text-xs text-faint",
								children: group.label
							}), group.items.map((chat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatRow, {
								chat,
								active: activeId === chat.id && view === "chat",
								onPick: () => selectChat(chat.id)
							}, chat.id))]
						}, group.label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-auto" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: cn(itemClass, view === "pricing" && "bg-hover"),
						onClick: () => setView("pricing"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletCards, { className: "size-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("truncate", hideLabel),
							children: "See plans and pricing"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: itemClass,
						onClick: () => setHelpOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleHelp, { className: "size-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: hideLabel,
							children: "Help"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: itemClass,
						onClick: () => setSettingsOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: hideLabel,
							children: "Settings"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-line p-2",
				children: user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: itemClass,
						onClick: () => setMenu((open) => !open),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-7 shrink-0 place-items-center rounded-full bg-accent text-xs font-medium text-accent-fg",
							children: user.name.slice(0, 1).toUpperCase()
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("min-w-0 flex-1 truncate text-left", hideLabel),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate",
								children: user.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-xs text-faint",
								children: user.email
							})]
						})]
					}), menu && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "shadow-pop absolute right-0 bottom-12 left-0 z-20 rounded-2xl border border-line bg-elevated p-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex h-10 w-full items-center rounded-xl px-3 text-sm hover:bg-hover",
							onClick: () => {
								setMenu(false);
								setView("pricing");
							},
							children: "Upgrade plan"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex h-10 w-full items-center rounded-xl px-3 text-sm hover:bg-hover",
							onClick: () => {
								setMenu(false);
								useChat.getState().signOut();
							},
							children: "Log out"
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("rounded-2xl bg-hover p-3", collapsed && "lg:bg-transparent lg:p-0"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("text-sm leading-5", hideLabel),
						children: "Log in to get answers based on saved chats, plus create images and upload files."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "mt-3 flex h-10 w-full items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-fg",
						onClick: () => setLoginOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: cn("hidden size-4", collapsed && "lg:block") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: hideLabel,
							children: "Log in"
						})]
					})]
				})
			})
		]
	})] });
}
function parse(source) {
	const chunks = source.split("```");
	const blocks = [];
	chunks.forEach((chunk, index) => {
		if (index % 2 === 1) {
			const lines = chunk.split("\n");
			const lang = (lines[0] ?? "").trim();
			const code = (lang ? lines.slice(1) : lines).join("\n").replace(/\n$/, "");
			blocks.push({
				type: "code",
				lang,
				code
			});
			return;
		}
		blocks.push(...parseText(chunk));
	});
	return blocks;
}
function parseText(source) {
	const lines = source.replace(/\n$/, "").split("\n");
	const blocks = [];
	let para = [];
	let list = null;
	let quote = null;
	const flushPara = () => {
		if (!para.length) return;
		blocks.push({
			type: "p",
			text: para.join("\n")
		});
		para = [];
	};
	const flushList = () => {
		if (!list) return;
		blocks.push(list.kind === "ul" ? {
			type: "ul",
			items: list.items
		} : {
			type: "ol",
			items: list.items
		});
		list = null;
	};
	const flushQuote = () => {
		if (!quote) return;
		blocks.push({
			type: "quote",
			text: quote.join("\n")
		});
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
			blocks.push({
				type: "heading",
				level: heading[1].length,
				text: heading[2]
			});
			continue;
		}
		if (bullet) {
			flushPara();
			flushQuote();
			if (!list || list.kind !== "ul") {
				flushList();
				list = {
					kind: "ul",
					items: []
				};
			}
			list.items.push(bullet[1]);
			continue;
		}
		if (numbered) {
			flushPara();
			flushQuote();
			if (!list || list.kind !== "ol") {
				flushList();
				list = {
					kind: "ol",
					items: []
				};
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
function inline(text, keyPrefix) {
	const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;
	const nodes = [];
	let last = 0;
	let match;
	let index = 0;
	while (match = pattern.exec(text)) {
		if (match.index > last) nodes.push(text.slice(last, match.index));
		const token = match[0];
		const key = `${keyPrefix}-${index++}`;
		if (token.startsWith("**")) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: token.slice(2, -2) }, key));
		else if (token.startsWith("`")) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
			className: "rounded bg-code px-1.5 py-0.5 text-[0.92em]",
			children: token.slice(1, -1)
		}, key));
		else if (token.startsWith("*")) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: token.slice(1, -1) }, key));
		else {
			const linked = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
			const href = linked?.[2] ?? "";
			if (linked && /^https?:\/\//.test(href)) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href,
				target: "_blank",
				rel: "noreferrer",
				className: "underline underline-offset-2",
				children: linked[1]
			}, key));
			else nodes.push(token);
		}
		last = match.index + token.length;
	}
	if (last < text.length) nodes.push(text.slice(last));
	return nodes;
}
function CodeBlock({ lang, code }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "my-3 overflow-hidden rounded-2xl bg-code",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between px-3 py-1.5 text-xs text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang || "code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-hover",
				onClick: () => {
					navigator.clipboard.writeText(code).then(() => {
						setCopied(true);
						window.setTimeout(() => setCopied(false), 1500);
					});
				},
				children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), copied ? "Copied" : "Copy"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "overflow-x-auto px-4 pb-4 text-sm leading-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: code })
		})]
	});
}
function Markdown({ source }) {
	const blocks = parse(source);
	if (!blocks.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3 text-base leading-7",
		children: blocks.map((block, index) => {
			const key = `b-${index}`;
			if (block.type === "code") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
				lang: block.lang,
				code: block.code
			}, key);
			if (block.type === "heading") {
				const Tag = block.level === 1 ? "h2" : "h3";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					className: cn("font-semibold tracking-tight", block.level === 1 ? "text-xl" : "text-lg"),
					children: inline(block.text, key)
				}, key);
			}
			if (block.type === "ul" || block.type === "ol") {
				const Tag = block.type === "ul" ? "ul" : "ol";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					className: cn("space-y-1 pl-5", block.type === "ul" ? "list-disc" : "list-decimal"),
					children: block.items.map((item, itemIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: inline(item, `${key}-${itemIndex}`) }, `${key}-${itemIndex}`))
				}, key);
			}
			if (block.type === "quote") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
				className: "border-l-2 border-line pl-3 text-muted",
				children: inline(block.text, key)
			}, key);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: block.text.split("\n").map((line, lineIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [lineIndex > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}), inline(line, `${key}-${lineIndex}`)] }, `${key}-${lineIndex}`)) }, key);
		})
	});
}
function Headline() {
	const [index, setIndex] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const timer = window.setInterval(() => setIndex((value) => (value + 1) % HEADLINES.length), 4200);
		return () => window.clearInterval(timer);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "headline-in text-center text-2xl font-medium tracking-tight sm:text-3xl",
		children: HEADLINES[index]
	}, HEADLINES[index]);
}
function ModelMenu({ align }) {
	const model = useChat((s) => s.model);
	const setModel = useChat((s) => s.setModel);
	const [open, setOpen] = (0, import_react.useState)(false);
	const current = MODELS.find((item) => item.id === model) ?? MODELS[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "inline-flex h-9 items-center gap-1 rounded-lg px-2 text-sm text-muted hover:bg-hover",
			"aria-expanded": open,
			onClick: () => setOpen((value) => !value),
			children: [
				align === "right" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden max-w-36 truncate sm:inline",
					children: current.label
				}),
				align === "left" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium text-fg",
					children: "Stick AI"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "fixed inset-0 z-20 cursor-default",
			"aria-label": "Close model menu",
			onClick: () => setOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("shadow-pop absolute z-30 mt-1 w-80 rounded-2xl border border-line bg-elevated p-1.5", align === "right" ? "right-0" : "left-0"),
			children: MODELS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex w-full items-start gap-2 rounded-xl px-3 py-2.5 text-left hover:bg-hover",
				onClick: () => {
					setModel(item.id);
					setOpen(false);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm",
						children: item.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs text-muted",
						children: item.blurb
					})]
				}), item.id === model && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 size-4 shrink-0" })]
			}, item.id))
		})] })]
	});
}
var TOOLS = [
	{
		id: "image",
		label: "Create image",
		icon: Image
	},
	{
		id: "thinking",
		label: "Thinking",
		icon: Lightbulb
	},
	{
		id: "research",
		label: "Deep research",
		icon: Telescope
	},
	{
		id: "search",
		label: "Web search",
		icon: Globe
	}
];
function Composer({ prominent }) {
	const mode = useChat((s) => s.mode);
	const setMode = useChat((s) => s.setMode);
	const status = useChat((s) => s.status);
	const seed = useChat((s) => s.seed);
	const [text, setText] = (0, import_react.useState)("");
	const [files, setFiles] = (0, import_react.useState)([]);
	const [menu, setMenu] = (0, import_react.useState)(false);
	const box = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!seed) return;
		setText(seed);
		useChat.getState().setSeed("");
		box.current?.focus();
	}, [seed]);
	(0, import_react.useEffect)(() => {
		const el = box.current;
		if (!el) return;
		el.style.height = "0px";
		el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
	}, [text]);
	async function onFiles(list) {
		if (!list) return;
		const next = [];
		for (const file of Array.from(list).slice(0, 4)) if (file.type.startsWith("image/")) {
			if (file.size > 15e5) {
				toast.error(`${file.name} is too large`);
				continue;
			}
			const dataUrl = await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(String(reader.result));
				reader.onerror = () => reject(/* @__PURE__ */ new Error("read"));
				reader.readAsDataURL(file);
			});
			next.push({
				id: crypto.randomUUID(),
				name: file.name,
				kind: "image",
				dataUrl
			});
		} else {
			const raw = file.size > 2e5 ? "" : await file.text();
			next.push({
				id: crypto.randomUUID(),
				name: file.name,
				kind: "file",
				text: raw ? raw.slice(0, 8e3) : "(file too large to read inline)"
			});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("composer-shell relative rounded-3xl", prominent ? "p-2" : "p-1.5"),
		children: [
			files.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2 px-2 pt-1 pb-1",
				children: files.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-2 rounded-xl bg-hover px-2 py-1 text-xs",
					children: [
						file.kind === "image" && file.dataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: file.dataUrl,
							alt: "",
							className: "size-8 rounded-md object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-3.5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "max-w-40 truncate",
							children: file.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": `Remove ${file.name}`,
							onClick: () => setFiles((current) => current.filter((item) => item.id !== file.id)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
						})
					]
				}, file.id))
			}),
			mode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-2 pt-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 rounded-full bg-hover px-2.5 py-1 text-xs",
					children: [TOOLS.find((tool) => tool.id === mode)?.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Remove tool",
						onClick: () => setMode(null),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Add files and tools",
							"aria-expanded": menu,
							className: "grid size-10 place-items-center rounded-full hover:bg-hover",
							onClick: () => setMenu((open) => !open),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" })
						}), menu && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "fixed inset-0 z-20 cursor-default",
							"aria-label": "Close tools",
							onClick: () => setMenu(false)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "shadow-pop absolute bottom-12 left-0 z-30 w-60 rounded-2xl border border-line bg-elevated p-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex h-10 w-full items-center gap-2 rounded-xl px-2.5 text-sm hover:bg-hover",
								onClick: () => {
									setMenu(false);
									fileRef.current?.click();
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-4" }), "Add photos & files"]
							}), TOOLS.map((tool) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex h-10 w-full items-center gap-2 rounded-xl px-2.5 text-sm hover:bg-hover",
								onClick: () => {
									setMode(mode === tool.id ? null : tool.id);
									setMenu(false);
									box.current?.focus();
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(tool.icon, { className: "size-4" }), tool.label]
							}, tool.id))]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "sr-only",
						htmlFor: "composer",
						children: "Message Stick AI"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "composer",
						ref: box,
						rows: 1,
						value: text,
						placeholder,
						suppressHydrationWarning: true,
						className: "max-h-52 min-h-10 flex-1 resize-none bg-transparent py-2.5 text-base outline-none placeholder:text-faint",
						onChange: (event) => setText(event.target.value),
						onKeyDown: (event) => {
							if (event.key === "Enter" && !event.shiftKey) {
								event.preventDefault();
								submit();
							}
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelMenu, { align: "right" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Voice",
						className: "grid size-10 place-items-center rounded-full hover:bg-hover",
						onClick: () => useChat.getState().setVoiceOpen(true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-5" })
					}),
					status === "streaming" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Stop generating",
						className: "grid size-10 place-items-center rounded-full bg-accent text-accent-fg",
						onClick: stopGeneration,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3.5 fill-current" })
					}) : text.trim() || files.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Send",
						className: "grid size-10 place-items-center rounded-full bg-accent text-accent-fg",
						onClick: () => void submit(),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-5" })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Voice mode",
						className: "grid size-10 place-items-center rounded-full bg-accent text-accent-fg",
						onClick: () => useChat.getState().setVoiceOpen(true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudioLines, { className: "size-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				className: "hidden",
				multiple: true,
				accept: "image/*,.txt,.md,.json,.csv,.js,.ts,.tsx,.py,.html,.css",
				suppressHydrationWarning: true,
				onChange: (event) => {
					onFiles(event.target.files);
					event.target.value = "";
				}
			})
		]
	});
}
function Disclaimer({ saveHint }) {
	const user = useChat((s) => s.user);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "px-2 pt-2 text-center text-xs text-faint",
		children: [
			"Stick AI can make mistakes. Check important info.",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "underline underline-offset-2",
				onClick: () => useChat.getState().setLegalOpen(true),
				children: "Terms"
			}),
			" & ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "underline underline-offset-2",
				onClick: () => useChat.getState().setLegalOpen(true),
				children: "Privacy"
			}),
			saveHint && !user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "underline underline-offset-2",
					onClick: () => useChat.getState().setLoginOpen(true),
					children: "Sign up or log in"
				}),
				" ",
				"to save chats."
			] })
		]
	});
}
var STARTERS = [
	{
		label: "Create an image",
		mode: "image"
	},
	{
		label: "Help me write",
		prompt: "Help me write "
	},
	{
		label: "Make a plan",
		prompt: "Help me make a plan for "
	},
	{
		label: "Brainstorm",
		prompt: "Brainstorm ideas for "
	},
	{
		label: "Explain a concept",
		prompt: "Explain this clearly: "
	}
];
function MessageView({ message, chatId, isLast }) {
	const status = useChat((s) => s.status);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(message.content);
	const [speaking, setSpeaking] = (0, import_react.useState)(false);
	const streaming = status === "streaming" && isLast && message.role === "assistant" && !message.error;
	if (message.role === "user") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "msg-in group flex justify-end",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-[85%]",
			children: [
				message.attachments && message.attachments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 flex flex-wrap justify-end gap-2",
					children: message.attachments.map((file) => file.kind === "image" && file.dataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: file.dataUrl,
						alt: file.name,
						className: "size-20 rounded-2xl object-cover"
					}, file.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-xl bg-bubble px-3 py-1.5 text-xs",
						children: file.name
					}, file.id))
				}),
				editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-[min(70vw,32rem)] rounded-3xl bg-bubble p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: draft,
						onChange: (event) => setDraft(event.target.value),
						className: "min-h-20 w-full resize-none bg-transparent text-base outline-none"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-9 rounded-full px-3 text-sm hover:bg-hover",
							onClick: () => setEditing(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-9 rounded-full bg-accent px-3 text-sm text-accent-fg",
							onClick: () => {
								setEditing(false);
								editAndResend(message.id, draft.trim());
							},
							children: "Send"
						})]
					})]
				}) : message.content && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-3xl bg-bubble px-4 py-2.5 text-base leading-7 whitespace-pre-wrap",
					children: message.content
				}),
				!editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 flex justify-end opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Edit message",
						className: "grid size-8 place-items-center rounded-lg hover:bg-hover",
						onClick: () => {
							setDraft(message.content);
							setEditing(true);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
					})
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "msg-in group",
		children: [
			streaming && !message.content && !message.imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center gap-2 text-sm text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo$1, { className: "working-spin size-4" }), "Working"]
			}),
			message.imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: message.imageUrl,
				alt: message.content || "Generated image",
				className: "mb-3 max-h-96 rounded-2xl"
			}),
			message.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: message.error
			}) : message.content && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, { source: message.content }),
			streaming && message.content && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-0.5 inline-block h-4 w-2 animate-pulse bg-fg align-middle" }),
			!streaming && (message.content || message.error || message.imageUrl) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("mt-1 flex gap-0.5", !isLast && "sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Copy",
						className: "grid size-8 place-items-center rounded-lg hover:bg-hover",
						onClick: () => {
							navigator.clipboard.writeText(message.content).then(() => toast("Copied"));
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Good response",
						className: cn("grid size-8 place-items-center rounded-lg hover:bg-hover", message.feedback === "up" && "bg-hover"),
						onClick: () => useChat.getState().setFeedback(chatId, message.id, "up"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Bad response",
						className: cn("grid size-8 place-items-center rounded-lg hover:bg-hover", message.feedback === "down" && "bg-hover"),
						onClick: () => useChat.getState().setFeedback(chatId, message.id, "down"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "size-4" })
					}),
					message.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Retry",
						className: "grid size-8 place-items-center rounded-lg hover:bg-hover",
						onClick: () => void regenerate(message.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" })
					}) : isLast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Regenerate",
						className: "grid size-8 place-items-center rounded-lg hover:bg-hover",
						onClick: () => void regenerate(message.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": speaking ? "Stop reading" : "Read aloud",
						className: "grid size-8 place-items-center rounded-lg hover:bg-hover",
						onClick: () => {
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
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
					})
				]
			})
		]
	});
}
function ChatStage() {
	const chat = useChat((s) => activeChat(s));
	const empty = !chat || chat.messages.length === 0;
	const scroller = (0, import_react.useRef)(null);
	const stick = (0, import_react.useRef)(true);
	const tail = chat?.messages[chat.messages.length - 1];
	(0, import_react.useEffect)(() => {
		const el = scroller.current;
		if (!el || !stick.current) return;
		el.scrollTop = el.scrollHeight;
	}, [
		chat?.id,
		chat?.messages.length,
		tail?.content,
		tail?.imageUrl,
		tail?.error
	]);
	if (empty) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headline, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-7 w-full max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, { prominent: true }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-wrap justify-center gap-2",
					children: STARTERS.map((starter) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-9 rounded-full border border-line px-3 text-sm hover:bg-hover",
						onClick: () => {
							if (starter.mode) useChat.getState().setMode(starter.mode);
							if (starter.prompt) useChat.getState().setSeed(starter.prompt);
							else document.getElementById("composer")?.focus();
						},
						children: starter.label
					}, starter.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Disclaimer, {})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: scroller,
			className: "scroll-thin min-h-0 flex-1 overflow-y-auto",
			onScroll: (event) => {
				const el = event.currentTarget;
				stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 90;
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6",
				children: chat.messages.map((message, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageView, {
					message,
					chatId: chat.id,
					isLast: index === chat.messages.length - 1
				}, message.id))
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-3 pb-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto w-full max-w-3xl",
				children: [
					!stick.current && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-8 rounded-full border border-line bg-canvas px-3 text-xs",
							onClick: () => {
								stick.current = true;
								const el = scroller.current;
								if (el) el.scrollTop = el.scrollHeight;
							},
							children: "Jump to latest"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Disclaimer, { saveHint: true })
				]
			})
		})]
	});
}
function Modal({ title, subtitle, onClose, wide, children }) {
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "scrim absolute inset-0",
			"aria-label": "Close dialog",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "dialog-title",
			className: cn("shadow-pop relative z-10 max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-elevated p-6 sm:rounded-3xl", wide ? "max-w-4xl" : "max-w-md"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Close",
					className: "absolute top-3 right-3 grid size-10 place-items-center rounded-full hover:bg-hover",
					onClick: onClose,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "dialog-title",
					className: "pr-8 text-xl font-medium tracking-tight",
					children: title
				}),
				subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: subtitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5",
					children
				})
			]
		})]
	});
}
function nameFromEmail(email) {
	const clean = (email.split("@")[0] ?? "You").replace(/[._-]+/g, " ").trim();
	if (!clean) return "You";
	return clean.charAt(0).toUpperCase() + clean.slice(1);
}
function LoginModal() {
	const setLoginOpen = useChat((s) => s.setLoginOpen);
	const signIn = useChat((s) => s.signIn);
	const [step, setStep] = (0, import_react.useState)("home");
	const [value, setValue] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	function finish(user) {
		signIn(user);
		toast(`Welcome, ${user.name}`);
	}
	function submitEmail() {
		const email = value.trim();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setError("Email is not valid.");
			return;
		}
		finish({
			name: nameFromEmail(email),
			email,
			method: "email"
		});
	}
	function submitPhone() {
		const phone = value.trim();
		if (phone.replace(/\D/g, "").length < 8) {
			setError("Enter a valid phone number.");
			return;
		}
		finish({
			name: "You",
			email: phone,
			method: "phone"
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		title: step === "home" ? "Log in or sign up" : step === "email" ? "Welcome back" : "Continue with phone",
		subtitle: "You'll get smarter responses and can upload files, images, and more.",
		onClose: () => setLoginOpen(false),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo$1, { className: "size-10" })
			}),
			step === "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					[
						{
							id: "google",
							label: "Continue with Google",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleMark, {})
						},
						{
							id: "microsoft",
							label: "Continue with Microsoft",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicrosoftMark, {})
						},
						{
							id: "apple",
							label: "Continue with Apple",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppleMark, {})
						}
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex h-12 w-full items-center justify-center gap-3 rounded-full border border-line text-sm hover:bg-hover",
						onClick: () => finish({
							name: item.id === "google" ? "Alex" : item.id === "apple" ? "Jordan" : "Sam",
							email: `${item.id} account`,
							method: item.id
						}),
						children: [item.icon, item.label]
					}, item.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex h-12 w-full items-center justify-center gap-3 rounded-full border border-line text-sm hover:bg-hover",
						onClick: () => {
							setStep("phone");
							setValue("");
							setError("");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "size-5" }), "Continue with phone"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 py-2 text-xs text-faint",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line" }),
							"OR",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-12 w-full rounded-full border border-line text-sm hover:bg-hover",
						onClick: () => {
							setStep("email");
							setValue("");
							setError("");
						},
						children: "Continue with email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pt-2 text-center text-xs text-faint",
						children: "This preview keeps your session on this device."
					})
				]
			}),
			step !== "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (event) => {
					event.preventDefault();
					if (step === "email") submitEmail();
					else submitPhone();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-sm",
						htmlFor: "login-value",
						children: step === "email" ? "Email address" : "Phone number"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "login-value",
						autoFocus: true,
						value,
						onChange: (event) => {
							setValue(event.target.value);
							setError("");
						},
						placeholder: step === "email" ? "Email address" : "+1",
						className: "h-12 w-full rounded-full border border-line bg-transparent px-4 outline-none focus:border-fg"
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "h-12 w-full rounded-full bg-accent text-sm font-medium text-accent-fg",
						children: "Continue"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-10 w-full text-sm text-muted",
						onClick: () => setStep("home"),
						children: "Back"
					})
				]
			})
		]
	});
}
var THEMES = [
	{
		id: "system",
		label: "System"
	},
	{
		id: "light",
		label: "Light"
	},
	{
		id: "dark",
		label: "Dark"
	}
];
function SettingsModal() {
	const setSettingsOpen = useChat((s) => s.setSettingsOpen);
	const theme = useChat((s) => s.theme);
	const setTheme = useChat((s) => s.setTheme);
	const instructions = useChat((s) => s.instructions);
	const setInstructions = useChat((s) => s.setInstructions);
	const improve = useChat((s) => s.improve);
	const setImprove = useChat((s) => s.setImprove);
	const [tab, setTab] = (0, import_react.useState)("general");
	const [confirm, setConfirm] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		title: "Settings",
		onClose: () => setSettingsOpen(false),
		wide: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 sm:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 sm:w-44 sm:flex-col",
				children: [
					["general", "General"],
					["personal", "Personalization"],
					["data", "Data controls"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: cn("h-10 rounded-xl px-3 text-left text-sm hover:bg-hover", tab === id && "bg-hover"),
					onClick: () => setTab(id),
					children: label
				}, id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					tab === "general" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "Theme"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 grid grid-cols-3 gap-2",
						children: THEMES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: cn("h-10 rounded-xl border border-line text-sm", theme === item.id && "border-fg"),
							onClick: () => setTheme(item.id),
							children: item.label
						}, item.id))
					})] }),
					tab === "personal" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Custom instructions", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: instructions,
							onChange: (event) => setInstructions(event.target.value.slice(0, 1500)),
							placeholder: "How should Stick AI respond?",
							className: "mt-2 min-h-36 w-full rounded-2xl border border-line bg-transparent p-3 outline-none focus:border-fg"
						})]
					}),
					tab === "data" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center justify-between gap-4 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Improve the model for everyone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								role: "switch",
								"aria-checked": improve,
								className: cn("h-7 w-12 rounded-full p-1", improve ? "bg-accent" : "bg-line"),
								onClick: () => setImprove(!improve),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("block size-5 rounded-full bg-canvas transition", improve && "translate-x-5") })
							})]
						}), confirm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-line p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: "Delete all chats on this device?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "h-9 rounded-full px-3 text-sm hover:bg-hover",
									onClick: () => setConfirm(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "h-9 rounded-full bg-danger px-3 text-sm text-on-danger",
									onClick: () => {
										useChat.getState().deleteAll();
										setConfirm(false);
										toast("Chats deleted");
									},
									children: "Delete"
								})]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-10 rounded-full border border-line px-4 text-sm",
							onClick: () => setConfirm(true),
							children: "Delete all chats"
						})]
					})
				]
			})]
		})
	});
}
function HelpModal() {
	const setHelpOpen = useChat((s) => s.setHelpOpen);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		title: "Help",
		subtitle: "A few ways to get around.",
		onClose: () => setHelpOpen(false),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "space-y-3 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Send a message" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: "Enter"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "New line" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: "Shift + Enter"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Search chats" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: "Ctrl/⌘ K"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "New chat" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: "Ctrl/⌘ Shift O"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Close a dialog" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: "Esc"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 space-y-3 text-sm text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Open the + menu to attach a file, create an image, think longer, run deep research, or search the web." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Chats stay in this browser. Log in on this device to keep a name on the session." })]
		})]
	});
}
function LegalModal() {
	const setLegalOpen = useChat((s) => s.setLegalOpen);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		title: "Terms and privacy",
		onClose: () => setLegalOpen(false),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 text-sm leading-6 text-muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Stick AI is AI and can make mistakes. Check important info." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "By using this preview you agree that chats are processed to generate a reply. Conversations are saved in this browser unless you delete them. Do not send secrets you would not put in a chat box." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Stick AI is made by Stick. Replies are generated by Grok. Plugins and model names come from the StickAI app." })
			]
		})
	});
}
function SearchModal() {
	const setSearchOpen = useChat((s) => s.setSearchOpen);
	const chats = useChat((s) => s.chats);
	const selectChat = useChat((s) => s.selectChat);
	const [query, setQuery] = (0, import_react.useState)("");
	const results = (0, import_react.useMemo)(() => {
		const needle = query.trim().toLowerCase();
		const sorted = [...chats].sort((a, b) => b.updatedAt - a.updatedAt);
		if (!needle) return sorted.slice(0, 12);
		return sorted.filter((chat) => chat.title.toLowerCase().includes(needle) || chat.messages.some((message) => message.content.toLowerCase().includes(needle))).slice(0, 20);
	}, [chats, query]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		title: "Search chats",
		onClose: () => setSearchOpen(false),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			autoFocus: true,
			value: query,
			onChange: (event) => setQuery(event.target.value),
			placeholder: "Search chats",
			className: "h-12 w-full rounded-full border border-line bg-transparent px-4 outline-none focus:border-fg"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 max-h-80 space-y-1 overflow-y-auto",
			children: [results.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-2 py-6 text-center text-sm text-muted",
				children: "No chats found"
			}), results.map((chat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "flex h-11 w-full items-center rounded-xl px-3 text-left text-sm hover:bg-hover",
				onClick: () => selectChat(chat.id),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: chat.title
				})
			}, chat.id))]
		})]
	});
}
function VoiceOverlay() {
	const setVoiceOpen = useChat((s) => s.setVoiceOpen);
	const [listening, setListening] = (0, import_react.useState)(false);
	const [transcript, setTranscript] = (0, import_react.useState)("");
	const [unsupported, setUnsupported] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
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
			} catch {}
		};
	}, [listening]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex flex-col bg-canvas",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-14 items-center justify-end px-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Close voice",
				className: "grid size-10 place-items-center rounded-full hover:bg-hover",
				onClick: () => setVoiceOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col items-center justify-center px-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("orb size-40 rounded-full", !listening && "opacity-70") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-lg",
					children: unsupported ? "Voice input isn't available in this browser." : listening ? "Listening…" : "Tap the orb and speak"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-md text-sm text-muted",
					children: transcript || "Your words will show up here."
				}),
				!unsupported && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-8 h-11 rounded-full bg-accent px-5 text-sm text-accent-fg",
					onClick: () => setListening((value) => !value),
					children: listening ? "Stop" : "Start"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: !transcript.trim(),
					className: "mt-3 h-11 rounded-full px-5 text-sm hover:bg-hover disabled:opacity-40",
					onClick: () => {
						sendComposer(transcript.trim(), []);
						setVoiceOpen(false);
					},
					children: "Send transcript"
				})
			]
		})]
	});
}
var PLANS = [
	{
		name: "Free",
		price: "$0",
		period: " / month",
		cta: "Your current plan",
		points: [
			"Stick on the web",
			"Limited messages and uploads",
			"Limited image creation",
			"Data controls on this device"
		],
		current: true
	},
	{
		name: "Plus",
		price: "$20",
		period: " / month",
		cta: "Get Plus",
		points: [
			"Everything in Free",
			"Higher message limits",
			"Stick 2",
			"More image generations",
			"Early access to new features"
		],
		featured: true
	},
	{
		name: "Pro",
		price: "$200",
		period: " / month",
		cta: "Get Pro",
		points: [
			"Everything in Plus",
			"Stick 2.1 and Stick Build",
			"Maximum reasoning effort",
			"Deep research at higher limits"
		]
	},
	{
		name: "Business",
		price: "$25",
		period: " / user / month",
		cta: "Contact sales",
		points: [
			"A shared workspace",
			"Admin controls",
			"SSO",
			"Your data stays out of training"
		]
	}
];
function PricingView() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "scroll-thin min-h-0 flex-1 overflow-y-auto px-4 py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-center text-3xl font-medium tracking-tight",
					children: "See plans and pricing"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-2 max-w-xl text-center text-sm text-muted",
					children: "Get smarter responses, upload files, create images, and more. Billing isn't connected in this preview."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4",
					children: PLANS.map((plan) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: cn("flex flex-col rounded-3xl border border-line p-5", plan.featured && "border-fg"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-medium",
								children: plan.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-medium tracking-tight",
									children: plan.price
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted",
									children: plan.period
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: cn("mt-4 h-10 rounded-full text-sm font-medium", plan.current ? "border border-line" : "bg-accent text-accent-fg"),
								onClick: () => {
									if (plan.current) return;
									if (!useChat.getState().user) useChat.getState().setLoginOpen(true);
									else toast("Checkout isn't available in this preview.");
								},
								children: plan.cta
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-5 space-y-2 text-sm",
								children: plan.points.map((point) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: point })]
								}, point))
							})
						]
					}, plan.name))
				})
			]
		})
	});
}
function ImagesView() {
	const chats = useChat((s) => s.chats);
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const images = chats.flatMap((chat) => chat.messages.filter((message) => message.imageUrl).map((message) => ({
		id: message.id,
		url: message.imageUrl,
		title: chat.title
	})));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "scroll-thin min-h-0 flex-1 overflow-y-auto px-4 py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-medium tracking-tight",
					children: "Images"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 flex gap-2",
					onSubmit: (event) => {
						event.preventDefault();
						if (!prompt.trim()) return;
						useChat.getState().newChat();
						useChat.getState().setMode("image");
						sendComposer(prompt.trim(), []);
						useChat.getState().setView("chat");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: prompt,
						onChange: (event) => setPrompt(event.target.value),
						placeholder: "Describe a new image",
						className: "h-12 flex-1 rounded-full border border-line bg-transparent px-4 outline-none focus:border-fg"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "h-12 rounded-full bg-accent px-4 text-sm text-accent-fg",
						children: "Create"
					})]
				}),
				images.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-10 text-center text-sm text-muted",
					children: "Images you create will show up here."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3",
					children: images.map((image) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: image.url,
						target: "_blank",
						rel: "noreferrer",
						className: "overflow-hidden rounded-2xl border border-line",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: image.url,
							alt: image.title,
							className: "aspect-square w-full object-cover"
						})
					}, image.id))
				})
			]
		})
	});
}
function Logo({ plugin }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "flex size-12 shrink-0 items-center justify-center rounded-xl bg-white p-2 ring-1 ring-black/10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: plugin.logo,
			alt: "",
			className: "size-full object-contain"
		})
	});
}
function PluginsView() {
	const enabled = useChat((s) => s.plugins);
	const setPlugin = useChat((s) => s.setPlugin);
	const setSeed = useChat((s) => s.setSeed);
	const newChat = useChat((s) => s.newChat);
	const setView = useChat((s) => s.setView);
	const [query, setQuery] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("All");
	const [open, setOpen] = (0, import_react.useState)(null);
	const list = (0, import_react.useMemo)(() => {
		const needle = query.trim().toLowerCase();
		return PLUGINS.filter((plugin) => {
			if (category !== "All" && plugin.category !== category) return false;
			if (!needle) return true;
			return plugin.name.toLowerCase().includes(needle) || plugin.tagline.toLowerCase().includes(needle) || plugin.description.toLowerCase().includes(needle);
		});
	}, [query, category]);
	const connect = (plugin, on) => {
		setPlugin(plugin.id, on);
		if (!on) {
			toast(`${plugin.name} disconnected`);
			return;
		}
		toast(plugin.account ? `${plugin.name} is on. Live account sign-in isn't set up in this preview, so Stick won't read your real ${plugin.name} yet.` : `${plugin.name} enabled. A live connection isn't available yet, so Stick will help in preview.`);
	};
	const startWith = (plugin, example) => {
		setPlugin(plugin.id, true);
		newChat();
		setSeed(example);
		setView("chat");
		setOpen(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "scroll-thin min-h-0 flex-1 overflow-y-auto px-4 py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-medium tracking-tight",
					children: "Plugins"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: ["The same 22 plugins from StickAI. ", enabled.length > 0 ? `${enabled.length} connected.` : "Connect the ones you want in chat."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex items-center gap-2 rounded-full border border-line px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: query,
						onChange: (event) => setQuery(event.target.value),
						placeholder: "Search plugins",
						"aria-label": "Search plugins",
						className: "h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-faint"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					role: "tablist",
					"aria-label": "Plugin categories",
					children: PLUGIN_CATEGORIES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": category === item,
						onClick: () => setCategory(item),
						className: category === item ? "rounded-full bg-accent px-3 py-1.5 text-sm text-accent-fg" : "rounded-full px-3 py-1.5 text-sm text-muted hover:bg-hover",
						children: item
					}, item))
				}),
				list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-16 text-center text-sm text-muted",
					children: [
						"No plugins match “",
						query,
						"”."
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid gap-3 sm:grid-cols-2",
					children: list.map((plugin) => {
						const on = enabled.includes(plugin.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-3xl border border-line p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex min-w-0 flex-1 items-center gap-3 text-left",
								"aria-label": `${plugin.name} details`,
								onClick: () => setOpen(plugin),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { plugin }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate font-medium",
										children: plugin.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block truncate text-sm text-muted",
										children: [plugin.tagline, plugin.account ? "" : " · Preview"]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": on,
								className: on ? "shrink-0 rounded-full border border-line px-4 py-1.5 text-sm" : "shrink-0 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-fg",
								onClick: () => connect(plugin, !on),
								children: on ? "Connected" : "Connect"
							})]
						}, plugin.id);
					})
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-50 grid place-items-center p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "scrim absolute inset-0",
				"aria-label": "Close",
				onClick: () => setOpen(null)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "dialog",
				"aria-modal": "true",
				"aria-labelledby": "plugin-title",
				className: "shadow-pop relative z-10 max-h-[min(640px,90dvh)] w-full max-w-lg overflow-y-auto rounded-3xl border border-line bg-elevated p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "absolute right-3 top-3 grid size-9 place-items-center rounded-full hover:bg-hover",
						"aria-label": "Close",
						onClick: () => setOpen(null),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 pr-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { plugin: open }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "plugin-title",
							className: "text-lg font-medium",
							children: open.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: open.tagline
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm",
						children: open.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: open.account ? "In the original StickAI app this plugin can sign in to a real account. Here it stays in preview until that server is connected." : "Preview only: a live connection for this plugin isn't available yet."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-2 mt-4 text-xs font-medium text-muted",
						children: "Try asking"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1.5",
						children: open.examples.map((example) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "w-full rounded-xl bg-hover px-3 py-2 text-left text-sm hover:bg-canvas",
							onClick: () => startWith(open, example),
							children: [
								"“",
								example,
								"”"
							]
						}) }, example))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-2 mt-4 text-xs font-medium text-muted",
						children: "What Stick can do with it"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1 text-sm",
						children: open.tools.map((tool) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 size-4 shrink-0" }), tool]
						}, tool))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: enabled.includes(open.id) ? "h-10 flex-1 rounded-full border border-line text-sm" : "h-10 flex-1 rounded-full bg-accent text-sm font-medium text-accent-fg",
							onClick: () => connect(open, !enabled.includes(open.id)),
							children: enabled.includes(open.id) ? "Disconnect" : "Connect"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-10 flex-1 rounded-full bg-accent text-sm font-medium text-accent-fg",
							onClick: () => startWith(open, open.examples[0] ?? ""),
							children: "Start a chat"
						})]
					})
				]
			})]
		})]
	});
}
function ChatApp() {
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
	(0, import_react.useEffect)(() => {
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
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
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
	(0, import_react.useEffect)(() => {
		document.title = chat && view === "chat" ? `${chat.title} - Stick AI` : "Stick AI";
	}, [chat, view]);
	const resolvedTheme = theme === "dark" || theme === "system" && typeof document !== "undefined" && document.documentElement.dataset.theme === "dark" ? "dark" : "light";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh bg-canvas text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex h-14 shrink-0 items-center gap-1 px-2 sm:px-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-10 place-items-center rounded-xl hover:bg-hover lg:hidden",
								"aria-label": "Open sidebar",
								onClick: () => setMobileOpen(true),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
							}),
							collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "hidden size-10 place-items-center rounded-xl hover:bg-hover lg:grid",
								"aria-label": "Open sidebar",
								onClick: () => setCollapsed(false),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeft, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelMenu, { align: "left" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" }),
							chat && chat.messages.length > 0 && view === "chat" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Share chat",
								className: "grid size-10 place-items-center rounded-xl hover:bg-hover",
								onClick: () => {
									const text = chat.messages.map((message) => `${message.role === "user" ? "You" : "Stick AI"}: ${message.content}`).join("\n\n");
									navigator.clipboard.writeText(text).then(() => toast("Conversation copied"));
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share, { className: "size-4" })
							}),
							!hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-9 w-28" }) : user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-9 rounded-full border border-line px-3 text-sm",
								onClick: () => setView("pricing"),
								children: "Upgrade"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn-login h-9 rounded-full px-3 text-sm font-medium",
									onClick: () => setLoginOpen(true),
									children: "Log in"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "btn-signup h-9 rounded-full px-3 text-sm font-medium",
									onClick: () => setLoginOpen(true),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sm:hidden",
										children: "Sign up"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "Sign up for free"
									})]
								})]
							})
						]
					}),
					view === "chat" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatStage, {}),
					view === "images" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagesView, {}),
					view === "plugins" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PluginsView, {}),
					view === "pricing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PricingView, {})
				]
			}),
			loginOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginModal, {}),
			settingsOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsModal, {}),
			helpOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HelpModal, {}),
			searchOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchModal, {}),
			legalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegalModal, {}),
			voiceOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceOverlay, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: resolvedTheme,
				position: "top-center"
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatApp, {});
}
//#endregion
export { Home as component };
