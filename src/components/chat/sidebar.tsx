import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  CircleHelp,
  Ellipsis,
  Image as ImageIcon,
  PanelLeft,
  Pencil,
  Pin,
  PinOff,
  Puzzle,
  Search,
  Settings,
  SquarePen,
  Telescope,
  Trash2,
  UserRound,
  WalletCards,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "./logo";
import { useChat } from "./store";
import type { Chat } from "./types";

function groupChats(chats: Chat[]) {
  const start = (time: number) => {
    const date = new Date(time);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  };
  const today = start(Date.now());
  const buckets = [
    { label: "Pinned", items: [] as Chat[] },
    { label: "Today", items: [] as Chat[] },
    { label: "Yesterday", items: [] as Chat[] },
    { label: "Previous 7 days", items: [] as Chat[] },
    { label: "Older", items: [] as Chat[] },
  ];
  for (const chat of [...chats].sort((a, b) => b.updatedAt - a.updatedAt)) {
    if (chat.pinned) {
      buckets[0].items.push(chat);
      continue;
    }
    const day = start(chat.updatedAt);
    if (day >= today) buckets[1].items.push(chat);
    else if (day >= today - 86_400_000) buckets[2].items.push(chat);
    else if (day >= today - 6 * 86_400_000) buckets[3].items.push(chat);
    else buckets[4].items.push(chat);
  }
  return buckets.filter((bucket) => bucket.items.length);
}

function ChatRow({ chat, active, onPick }: { chat: Chat; active: boolean; onPick: () => void }) {
  const renameChat = useChat((s) => s.renameChat);
  const togglePin = useChat((s) => s.togglePin);
  const deleteChat = useChat((s) => s.deleteChat);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(chat.title);
  const [open, setOpen] = useState(false);

  if (editing) {
    return (
      <input
        autoFocus
        value={value}
        aria-label="Rename chat"
        className="h-9 w-full rounded-lg bg-hover px-2.5 text-sm outline-none ring-1 ring-fg"
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => {
          renameChat(chat.id, value.trim() || chat.title);
          setEditing(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") (event.target as HTMLInputElement).blur();
          if (event.key === "Escape") {
            setValue(chat.title);
            setEditing(false);
          }
        }}
      />
    );
  }

  const itemClass = "flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm outline-none hover:bg-hover";

  return (
    <div className={cn("group flex items-center rounded-lg", active ? "bg-hover" : "hover:bg-hover")}>
      <button type="button" onClick={onPick} className="h-9 min-w-0 flex-1 truncate px-2.5 text-left text-sm">
        {chat.title}
      </button>
      <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger
          aria-label={`Options for ${chat.title}`}
          className={cn(
            "mr-1 grid size-7 shrink-0 place-items-center rounded-md text-muted hover:bg-canvas hover:text-fg",
            "opacity-100 md:opacity-0 md:group-hover:opacity-100",
            open && "opacity-100",
          )}
        >
          <Ellipsis className="size-4" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            sideOffset={4}
            className="shadow-pop z-50 min-w-40 rounded-xl border border-line bg-elevated p-1"
          >
            <DropdownMenu.Item className={itemClass} onSelect={() => togglePin(chat.id)}>
              {chat.pinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
              {chat.pinned ? "Unpin" : "Pin"}
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className={itemClass}
              onSelect={() => {
                setValue(chat.title);
                setEditing(true);
              }}
            >
              <Pencil className="size-4" />
              Rename
            </DropdownMenu.Item>
            <DropdownMenu.Item className={cn(itemClass, "text-danger")} onSelect={() => deleteChat(chat.id)}>
              <Trash2 className="size-4" />
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}

export function Sidebar() {
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
  const [menu, setMenu] = useState(false);

  const closeMobile = () => setMobileOpen(false);
  const hideLabel = collapsed ? "lg:hidden" : "";

  const itemClass =
    "flex h-10 w-full items-center gap-3 rounded-xl px-2.5 text-left text-sm hover:bg-hover";

  return (
    <>
      {mobileOpen && (
        <button className="scrim fixed inset-0 z-30 lg:hidden" aria-label="Close menu" onClick={closeMobile} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-fg transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:translate-x-0",
          collapsed && "lg:w-16",
        )}
      >
        <div className="flex h-14 items-center gap-2 px-2.5">
          <Logo className="size-7 shrink-0" />
          <span className={cn("truncate text-sm font-medium", hideLabel)}>Stick AI</span>
          <button
            type="button"
            className="ml-auto grid size-10 place-items-center rounded-xl hover:bg-hover"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => {
              if (window.innerWidth < 1024) closeMobile();
              else setCollapsed(!collapsed);
            }}
          >
            <PanelLeft className="size-5" />
          </button>
        </div>

        <nav className="scroll-thin flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-2" aria-label="Primary">
          <button
            type="button"
            className={itemClass}
            onClick={() => {
              newChat();
            }}
          >
            <SquarePen className="size-5 shrink-0" />
            <span className={hideLabel}>New chat</span>
          </button>
          <button type="button" className={itemClass} onClick={() => setSearchOpen(true)}>
            <Search className="size-5 shrink-0" />
            <span className={hideLabel}>Search chats</span>
          </button>
          <button
            type="button"
            className={cn(itemClass, view === "images" && "bg-hover")}
            onClick={() => setView("images")}
          >
            <ImageIcon className="size-5 shrink-0" />
            <span className={hideLabel}>Images</span>
          </button>
          <button
            type="button"
            className={cn(itemClass, view === "plugins" && "bg-hover")}
            onClick={() => setView("plugins")}
          >
            <Puzzle className="size-5 shrink-0" />
            <span className={hideLabel}>Plugins</span>
          </button>
          <button
            type="button"
            className={itemClass}
            onClick={() => {
              setMode("research");
              setView("chat");
              newChat();
              setMode("research");
            }}
          >
            <Telescope className="size-5 shrink-0" />
            <span className={hideLabel}>Deep research</span>
          </button>

          {hydrated && chats.length > 0 && (
            <div className={cn("mt-3", hideLabel)}>
              {groupChats(chats).map((group) => (
                <div key={group.label} className="mb-2">
                  <p className="px-2.5 py-1 text-xs text-faint">{group.label}</p>
                  {group.items.map((chat) => (
                    <ChatRow
                      key={chat.id}
                      chat={chat}
                      active={activeId === chat.id && view === "chat"}
                      onPick={() => selectChat(chat.id)}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}

          <div className="mt-auto" />
          <button
            type="button"
            className={cn(itemClass, view === "pricing" && "bg-hover")}
            onClick={() => setView("pricing")}
          >
            <WalletCards className="size-5 shrink-0" />
            <span className={cn("truncate", hideLabel)}>See plans and pricing</span>
          </button>
          <button type="button" className={itemClass} onClick={() => setHelpOpen(true)}>
            <CircleHelp className="size-5 shrink-0" />
            <span className={hideLabel}>Help</span>
          </button>
          <button type="button" className={itemClass} onClick={() => setSettingsOpen(true)}>
            <Settings className="size-5 shrink-0" />
            <span className={hideLabel}>Settings</span>
          </button>
        </nav>

        <div className="border-t border-line p-2">
          {user ? (
            <div className="relative">
              <button type="button" className={itemClass} onClick={() => setMenu((open) => !open)}>
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent text-xs font-medium text-accent-fg">
                  {user.name.slice(0, 1).toUpperCase()}
                </span>
                <span className={cn("min-w-0 flex-1 truncate text-left", hideLabel)}>
                  <span className="block truncate">{user.name}</span>
                  <span className="block truncate text-xs text-faint">{user.email}</span>
                </span>
              </button>
              {menu && (
                <div className="shadow-pop absolute right-0 bottom-12 left-0 z-20 rounded-2xl border border-line bg-elevated p-1">
                  <button
                    type="button"
                    className="flex h-10 w-full items-center rounded-xl px-3 text-sm hover:bg-hover"
                    onClick={() => {
                      setMenu(false);
                      setView("pricing");
                    }}
                  >
                    Upgrade plan
                  </button>
                  <button
                    type="button"
                    className="flex h-10 w-full items-center rounded-xl px-3 text-sm hover:bg-hover"
                    onClick={() => {
                      setMenu(false);
                      useChat.getState().signOut();
                    }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={cn("rounded-2xl bg-hover p-3", collapsed && "lg:bg-transparent lg:p-0")}>
              <p className={cn("text-sm leading-5", hideLabel)}>
                Log in to get answers based on saved chats, plus create images and upload files.
              </p>
              <button
                type="button"
                className="mt-3 flex h-10 w-full items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-fg"
                onClick={() => setLoginOpen(true)}
              >
                <UserRound className={cn("hidden size-4", collapsed && "lg:block")} />
                <span className={hideLabel}>Log in</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
