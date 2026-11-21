export type PluginCategory =
  | "Productivity"
  | "Communication"
  | "Developer"
  | "Travel"
  | "Music & events"
  | "Business"
  | "Design";

export type Plugin = {
  id: string;
  name: string;
  category: PluginCategory;
  logo: string;
  tagline: string;
  description: string;
  /** Live account linking exists in the original StickAI server. This preview only enables the plugin. */
  account?: "google" | "slack";
  examples: string[];
  tools: string[];
};

export const PLUGINS: Plugin[] = [
  {
    id: "outlook",
    name: "Outlook",
    category: "Productivity",
    logo: "/plugins/outlook.svg",
    tagline: "Email and calendar",
    description: "Read, search and draft email, and check or create calendar events.",
    examples: ["Summarize my unread emails", "Draft a reply to my last email", "What's on my calendar tomorrow?"],
    tools: ["Search the mailbox", "Create an email draft", "List calendar events"],
  },
  {
    id: "granola",
    name: "Granola",
    category: "Productivity",
    logo: "/plugins/granola.svg",
    tagline: "Meeting notes",
    description: "Find and summarize your meeting notes and pull out action items.",
    examples: ["Summarize my last meeting", "List action items from this week's calls"],
    tools: ["Search meeting notes", "Open one meeting note"],
  },
  {
    id: "canva",
    name: "Canva",
    category: "Design",
    logo: "/plugins/canva.svg",
    tagline: "Design and presentations",
    description: "Create designs, social posts and slide decks, and edit existing ones.",
    examples: ["Make an Instagram post for my bakery", "Create a 5-slide pitch deck"],
    tools: ["Create a design from a prompt", "List recent designs"],
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "Business",
    logo: "/plugins/hubspot.svg",
    tagline: "CRM",
    description: "Look up contacts, companies and deals, and log notes or follow-ups.",
    examples: ["Show my open deals", "Find the contact for Acme Corp"],
    tools: ["Search contacts", "List deals", "Add a note to a contact"],
  },
  {
    id: "gusto",
    name: "Gusto",
    category: "Business",
    logo: "/plugins/gusto.svg",
    tagline: "Payroll and HR",
    description: "Check payroll runs, time off and team details.",
    examples: ["When is the next payroll run?", "Who is out this week?"],
    tools: ["Get the next payroll run", "List approved time off"],
  },
  {
    id: "expedia",
    name: "Expedia",
    category: "Travel",
    logo: "/plugins/expedia.svg",
    tagline: "Flights, hotels, cars",
    description: "Search flights, hotels and rental cars and compare options.",
    examples: ["Find flights to Denver next Friday", "Hotels in Orlando under $150"],
    tools: ["Search flights", "Search hotels"],
  },
  {
    id: "trip-com",
    name: "Trip.com",
    category: "Travel",
    logo: "/plugins/trip-com.svg",
    tagline: "Trains, flights, stays",
    description: "Compare flights, trains and hotels, especially for international trips.",
    examples: ["Train options from Paris to Amsterdam", "Cheap hotels in Tokyo"],
    tools: ["Search flights or trains", "Search hotels"],
  },
  {
    id: "wikiloc",
    name: "Wikiloc",
    category: "Travel",
    logo: "/plugins/wikiloc.svg",
    tagline: "Hiking and outdoor trails",
    description: "Discover hiking, cycling and running routes with distance and elevation.",
    examples: ["Easy hikes near me", "Best 20 km cycling routes nearby"],
    tools: ["Search trails by place and activity"],
  },
  {
    id: "ticketmaster",
    name: "Ticketmaster",
    category: "Music & events",
    logo: "/plugins/ticketmaster.svg",
    tagline: "Live events",
    description: "Find concerts, sports and shows and check dates and venues.",
    examples: ["Concerts this month near me", "When does the tour hit Miami?"],
    tools: ["Search upcoming events"],
  },
  {
    id: "apple-music",
    name: "Apple Music",
    category: "Music & events",
    logo: "/plugins/apple-music.svg",
    tagline: "Music and playlists",
    description: "Search songs and albums and build playlists.",
    examples: ["Make a chill study playlist", "Songs like this artist"],
    tools: ["Search the catalog", "Create a playlist"],
  },
  {
    id: "shazam",
    name: "Shazam",
    category: "Music & events",
    logo: "/plugins/shazam.svg",
    tagline: "Name that song",
    description: "Identify a song from a short audio clip or a few lyrics you remember.",
    examples: ["What song has the lyric about a midnight train?", "Identify this clip"],
    tools: ["Identify a song from lyrics or a clip"],
  },
  {
    id: "gmail",
    name: "Gmail",
    category: "Communication",
    logo: "/plugins/gmail.svg",
    tagline: "Email",
    account: "google",
    description: "Read, search and draft Gmail messages.",
    examples: ["Summarize my unread Gmail", "Draft a reply to my last email"],
    tools: ["Search Gmail", "Create an email draft"],
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    category: "Productivity",
    logo: "/plugins/google-calendar.svg",
    tagline: "Events and scheduling",
    account: "google",
    description: "View and create calendar events and find free time.",
    examples: ["What's on my calendar tomorrow?", "Find a free hour this week"],
    tools: ["List events", "Create a calendar event"],
  },
  {
    id: "google-drive",
    name: "Google Drive",
    category: "Productivity",
    logo: "/plugins/google-drive.svg",
    tagline: "Files and docs",
    account: "google",
    description: "Find and read files in your Drive.",
    examples: ["Find my budget spreadsheet", "Summarize the doc I edited yesterday"],
    tools: ["Search Drive files", "Read a file"],
  },
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    logo: "/plugins/slack.svg",
    tagline: "Team chat",
    account: "slack",
    description: "Search channels and messages and post updates.",
    examples: ["What did I miss in #general?", "Post my standup update"],
    tools: ["Search messages", "Post a message to a channel"],
  },
  {
    id: "zoom",
    name: "Zoom",
    category: "Communication",
    logo: "/plugins/zoom.svg",
    tagline: "Video meetings",
    description: "Schedule meetings and get recordings and summaries.",
    examples: ["Schedule a Zoom for Friday 2pm", "Summarize my last Zoom"],
    tools: ["Create a meeting", "List recent recordings"],
  },
  {
    id: "notion",
    name: "Notion",
    category: "Productivity",
    logo: "/plugins/notion.svg",
    tagline: "Notes and wikis",
    description: "Search pages and databases and add notes.",
    examples: ["Find my project plan in Notion", "Add a to-do to my tasks page"],
    tools: ["Search pages", "Create a page"],
  },
  {
    id: "github",
    name: "GitHub",
    category: "Developer",
    logo: "/plugins/github.svg",
    tagline: "Code and issues",
    description: "Browse repos, issues and pull requests.",
    examples: ["List my open pull requests", "Create an issue for this bug"],
    tools: ["Search issues and pull requests", "Create an issue"],
  },
  {
    id: "figma",
    name: "Figma",
    category: "Design",
    logo: "/plugins/figma.svg",
    tagline: "Design files",
    description: "Look up Figma files and frames and read design details.",
    examples: ["Show my latest Figma files", "Describe the homepage frame"],
    tools: ["List recent files", "Get a frame's details"],
  },
  {
    id: "spotify",
    name: "Spotify",
    category: "Music & events",
    logo: "/plugins/spotify.svg",
    tagline: "Music and podcasts",
    description: "Search music, build playlists and see what you've been playing.",
    examples: ["Make a workout playlist", "What have I been listening to?"],
    tools: ["Search tracks, albums or artists", "Create a playlist"],
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Business",
    logo: "/plugins/stripe.svg",
    tagline: "Payments",
    description: "Check payments, customers and payouts.",
    examples: ["How much revenue came in this week?", "Find the last payment from Sam"],
    tools: ["List recent payments", "Find a customer"],
  },
  {
    id: "shopify",
    name: "Shopify",
    category: "Business",
    logo: "/plugins/shopify.svg",
    tagline: "Online store",
    description: "Check orders, products and inventory.",
    examples: ["How many orders today?", "Which products are low on stock?"],
    tools: ["List recent orders", "List products low on stock"],
  },
];

export const PLUGIN_CATEGORIES = ["All", ...Array.from(new Set(PLUGINS.map((plugin) => plugin.category)))] as const;

export function pluginById(id: string) {
  return PLUGINS.find((plugin) => plugin.id === id);
}
