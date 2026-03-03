import { BotTemplate } from "../types/bot";
import { node, option } from "./helpers";

export const agendamento: BotTemplate = {
  key: "agendamento",
  name: "Agendamento",
  description: "Fluxo simples para marcar horário.",
  create: () => {
    const start = node(
      "Menu inicial",
      `Olá! 👋 Aqui é o agendamento da {{empresa}}.

Escolha uma opção:`
    );

    const servico = node(
      "Escolher serviço",
      `Qual serviço você deseja?

1) {{servico_1}}
2) {{servico_2}}
3) {{servico_3}}`
    );

    const horario = node(
      "Escolher horário",
      `Perfeito!

Agora envie a data e horário desejado.
Exemplo: 20/05 às 14:30`
    );

    const envio = node(
      "Confirmar",
      `Ótimo! 🙋‍♂️
Para confirmar, chama a gente no WhatsApp: {{whatsapp}}`
    );

    start.options = [
      option("1 - Agendar horário", servico.id),
      option("2 - Falar com atendente", envio.id),
    ];

    servico.options = [
      option("1 - Escolher horário", horario.id),
      option("2 - Voltar", start.id),
    ];

    horario.options = [
      option("1 - Confirmar no WhatsApp", envio.id),
      option("2 - Voltar", servico.id),
    ];

    envio.options = [
      option("1 - Voltar ao menu", start.id),
    ];

    return {
      templateKey: "agendamento",
      startNodeId: start.id,
      nodes: [start, servico, horario, envio],
    };
  },
};