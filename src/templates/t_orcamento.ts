import { BotTemplate } from "../types/bot";
import { node, option } from "./helpers";

export const orcamento: BotTemplate = {
  key: "orcamento",
  name: "Orçamento (serviços/lojas)",
  description: "Fluxo curto: entender necessidade → pedir 2 dados → mandar pro humano.",
  create: () => {
    const start = node(
      "Menu inicial",
      `Olá! 👋 Aqui é o orçamento da {{empresa}}.

Escolha uma opção:`
    );

    const tipo = node(
      "Tipo de orçamento",
      `O que você quer orçar?

1) {{item_1}}
2) {{item_2}}
3) {{item_3}}`
    );

    const detalhes = node(
      "Detalhes",
      `✅ Certo.
Agora mande uma mensagem com:
- O que você precisa
- Quantidade / tamanho (se tiver)

Exemplo: 'Quero 2 unidades do item X, tamanho M'.`
    );

    const envio = node(
      "Enviar para atendimento",
      `Perfeito! 🙋‍♀️
Para agilizar, chama a gente no WhatsApp: {{whatsapp}}

A gente responde com valor e prazo.`
    );

    const info = node(
      "Informações",
      `📍 Endereço: {{endereco}}
🕒 Horário: {{horario}}

Quer fazer um orçamento?`
    );

    start.options = [
      option("1 - Fazer orçamento", tipo.id),
      option("2 - Informações", info.id),
      option("3 - Falar com atendente", envio.id),
    ];

    tipo.options = [
      option("1 - Item 1", detalhes.id),
      option("2 - Item 2", detalhes.id),
      option("3 - Item 3", detalhes.id),
      option("4 - Voltar", start.id),
    ];

    detalhes.options = [
      option("1 - Enviar no WhatsApp", envio.id),
      option("2 - Voltar", tipo.id),
    ];

    envio.options = [option("1 - Voltar ao menu", start.id)];

    info.options = [
      option("1 - Fazer orçamento", tipo.id),
      option("2 - Voltar ao menu", start.id),
    ];

    return {
      templateKey: "orcamento",
      startNodeId: start.id,
      nodes: [start, tipo, detalhes, envio, info],
    };
  },
};