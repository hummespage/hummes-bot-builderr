import { BotProject } from "../types/bot";

export type ValidationIssue = { type: "error" | "warn"; message: string };

export function validateBot(bot: BotProject): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const nodeIds = new Set(bot.nodes.map(n => n.id));

  if (!nodeIds.has(bot.startNodeId)) {
    issues.push({ type: "error", message: "startNodeId aponta para um nó que não existe." });
  }

  for (const n of bot.nodes) {
    for (const o of n.options) {
      if (o.nextNodeId !== null && !nodeIds.has(o.nextNodeId)) {
        issues.push({ type: "error", message: `Opção '${o.label}' do nó '${n.title}' aponta para destino inválido.` });
      }
    }
  }

  // Warn se tiver nó órfão (não referenciado)
  const referenced = new Set<string>();
  referenced.add(bot.startNodeId);
  for (const n of bot.nodes) {
    for (const o of n.options) {
      if (o.nextNodeId) referenced.add(o.nextNodeId);
    }
  }
  for (const n of bot.nodes) {
    if (!referenced.has(n.id)) {
      issues.push({ type: "warn", message: `Nó '${n.title}' parece órfão (ninguém aponta para ele).` });
    }
  }

  return issues;
}
