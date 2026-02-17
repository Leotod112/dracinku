export type HistoryItem = {
  id: string;
  platform?: string;
  title?: string;
  episode?: number | null;
  url?: string;
  playedAt: string; // ISO
};

const KEY = "dracinkuu:watch_history";
const MAX_ITEMS = 500;

function now() {
  return new Date().toISOString();
}

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryItem[];
  } catch (e) {
    console.warn("getHistory failed", e);
    return [];
  }
}

export function setHistory(items: HistoryItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch (e) {
    console.warn("setHistory failed", e);
  }
}

export function addToHistory(item: Omit<HistoryItem, "playedAt">) {
  if (typeof window === "undefined") return;
  try {
    const list = getHistory();

    // dedupe by id+platform+episode
    const filtered = list.filter(
      (h) => !(h.id === item.id && h.platform === item.platform && h.episode === item.episode)
    );

    const next: HistoryItem = { ...item, playedAt: now() } as HistoryItem;

    filtered.unshift(next);

    if (filtered.length > MAX_ITEMS) filtered.length = MAX_ITEMS;

    setHistory(filtered);
  } catch (e) {
    console.warn("addToHistory failed", e);
  }
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
    console.warn("clearHistory failed", e);
  }
}

export function getHistorySizeBytes(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(KEY) || "";
    // accurate byte length using TextEncoder
    if (typeof TextEncoder !== "undefined") {
      return new TextEncoder().encode(raw).length;
    }
    return raw.length;
  } catch (e) {
    return 0;
  }
}

export function removeHistoryItem(index: number) {
  if (typeof window === "undefined") return;
  try {
    const list = getHistory();
    if (index < 0 || index >= list.length) return;
    list.splice(index, 1);
    setHistory(list);
  } catch (e) {
    console.warn(e);
  }
}
