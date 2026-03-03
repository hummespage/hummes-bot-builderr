import { BotTemplate } from "../types/bot";
import { node, option } from "./helpers";

export const cardapio: BotTemplate = {
  key: "cardapio",
  name: "Cardápio (pizzaria/lanches)",
  description: "Menu com categorias → itens → como pedir. Sem complicar.",
  create: () => {
    const empresa = "sua empresa";
    const start = node(
      "Menu inicial",
      `✨ Olá! Você está falando com a ${empresa}.

Escolha uma opção:`
    );

    const cat = node(
      "Categorias",
      "📋 Cardápio — escolha uma categoria:"
    );

    const pizzas = node(
      "Pizzas",
      `🍕 Pizzas:
{{pizzas}}

Como você quer pedir?`
    );

    const lanches = node(
      "Lanches",
      `🍔 Lanches:
{{lanches}}

Como você quer pedir?`
    );

    const bebidas = node(
      "Bebidas",
      `🥤 Bebidas:
{{bebidas}}

Como você quer pedir?`
    );

    const pedir = node(
      "Como pedir",
      `✅ Para pedir, chama no WhatsApp: {{whatsapp}}

Ou envie sua escolha (ex: "Pizza Calabresa + refri") que a gente atende.`
    );

    start.options = [
      option("1 - Ver cardápio", cat.id),
      option("2 - Horários e endereço", null),
      option("3 - Falar com atendente", pedir.id),
    ];

    cat.options = [
      option("1 - Pizzas", pizzas.id),
      option("2 - Lanches", lanches.id),
      option("3 - Bebidas", bebidas.id),
      option("4 - Voltar", start.id),
    ];

    pizzas.options = [
      option("1 - Pedir agora", pedir.id),
      option("2 - Voltar categorias", cat.id),
    ];

    lanches.options = [
      option("1 - Pedir agora", pedir.id),
      option("2 - Voltar categorias", cat.id),
    ];

    bebidas.options = [
      option("1 - Pedir agora", pedir.id),
      option("2 - Voltar categorias", cat.id),
    ];

    pedir.options = [
      option("1 - Voltar ao menu", start.id),
    ];

    return {
      templateKey: "cardapio",
      startNodeId: start.id,
      nodes: [start, cat, pizzas, lanches, bebidas, pedir],
    };
  },
};