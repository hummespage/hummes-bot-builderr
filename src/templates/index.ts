import { BotTemplate } from "../types/bot";
import { atendimentoSimples } from "./t_atendimento";
import { cardapio } from "./t_cardapio";
import { agendamento } from "./t_agendamento";
import { orcamento } from "./t_orcamento";

export const BOT_TEMPLATES: BotTemplate[] = [
  atendimentoSimples,
  cardapio,
  agendamento,
  orcamento,
];

export function getTemplate(key: string): BotTemplate | undefined {
  return BOT_TEMPLATES.find(t => t.key === key);
}
