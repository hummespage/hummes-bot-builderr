export type BotOption = {
  id: string;
  label: string;
  nextNodeId: string | null; // null = finaliza / sem destino
};

export type BotNode = {
  id: string;
  title: string;
  message: string;
  options: BotOption[];
};

export type BotProject = {
  id: string;
  name: string;
  templateKey: string;
  createdAt: number;
  updatedAt: number;
  startNodeId: string;
  nodes: BotNode[];
};

export type BotTemplate = {
  key: string;
  name: string;
  description: string;
  create: () => Omit<BotProject, "id" | "name" | "createdAt" | "updatedAt">;
};
