import { v4 as uuid } from "uuid";
import { BotNode } from "../types/bot";

export function node(title: string, message: string): BotNode {
  return { id: uuid(), title, message, options: [] };
}

export function option(label: string, nextNodeId: string | null) {
  return { id: uuid(), label, nextNodeId };
}
