import { BotProject } from "../types/bot";

const KEY = "botsuite.bots.v1";

export function loadBots(): BotProject[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BotProject[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveBots(bots: BotProject[]) {
  localStorage.setItem(KEY, JSON.stringify(bots));
}

export function upsertBot(updated: BotProject) {
  const bots = loadBots();
  const idx = bots.findIndex(b => b.id === updated.id);
  if (idx >= 0) bots[idx] = updated;
  else bots.unshift(updated);
  saveBots(bots);
}

export function deleteBot(id: string) {
  const bots = loadBots().filter(b => b.id !== id);
  saveBots(bots);
}
