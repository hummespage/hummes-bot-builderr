import { BotTemplate } from "../types/bot";
import { node, option } from "./helpers";

export const atendimentoSimples: BotTemplate = {
  key: "atendimento_simples",
  name: "Atendimento simples",
  description:
    "Menu inicial + informações + falar com humano. Perfeito pra barbearia/salão/loja.",
  create: () => {
    const start = node(
      "Menu inicial",
      `Olá! 👋 Seja bem-vindo(a) à {{empresa}}.

Escolha uma opção:`
    );

    const info = node(
      "Informações",
      `📍 Endereço: {{endereco}}
🕒 Horário: {{horario}}

Quer mais alguma coisa?`
    );

    const servicos = node(
      "Serviços",
      `✅ Nossos serviços:
{{lista_servicos}}

Quer falar com alguém?`
    );

    const humano = node(
      "Falar com atendente",
      `Perfeito! 🙋‍♂️
Chama a gente no WhatsApp: {{whatsapp}}

Se preferir, diga 'voltar' para o menu.`
    );

    // ligações
    start.options = [
      option("1 - Ver serviços", servicos.id),
      option("2 - Informações (endereço/horário)", info.id),
      option("3 - Falar com atendente", humano.id),
    ];

    servicos.options = [
      option("1 - Falar com atendente", humano.id),
      option("2 - Voltar ao menu", start.id),
    ];

    info.options = [
      option("1 - Voltar ao menu", start.id),
      option("2 - Falar com atendente", humano.id),
    ];

    humano.options = [option("1 - Voltar ao menu", start.id)];

    return {
      templateKey: "atendimento_simples",
      startNodeId: start.id,
      nodes: [start, servicos, info, humano],
    };
  },
};