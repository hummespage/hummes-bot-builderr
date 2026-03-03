import { BotProject } from "../types/bot";

function findIncoming(bot: BotProject) {
  const incoming = new Map<string, number>();
  for (const n of bot.nodes) incoming.set(n.id, 0);
  for (const n of bot.nodes) {
    for (const o of n.options) {
      if (o.nextNodeId) incoming.set(o.nextNodeId, (incoming.get(o.nextNodeId) ?? 0) + 1);
    }
  }
  return incoming;
}

export default function NodeTree({
  bot,
  selectedNodeId,
  onSelectNode,
}: {
  bot: BotProject;
  selectedNodeId: string;
  onSelectNode: (id: string) => void;
}) {
  const incoming = findIncoming(bot);

  return (
    <div className="list">
      {bot.nodes.map((n) => {
        const isStart = n.id === bot.startNodeId;
        const inc = incoming.get(n.id) ?? 0;
        const orphan = !isStart && inc === 0;

        return (
          <div
            key={n.id}
            className={"item " + (n.id === selectedNodeId ? "selected" : "")}
            style={{ cursor: "pointer" }}
            onClick={() => onSelectNode(n.id)}
          >
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 900, display: "flex", gap: 8, alignItems: "center" }}>
                  {isStart ? "🟢" : orphan ? "🟠" : "⚪"} {n.title}
                </div>
                <div className="small">{n.options.length} opção(ões)</div>
              </div>
              <div className="pill" title={orphan ? "Nó órfão" : "Referências"}>
                ↩︎ {inc}
              </div>
            </div>
          </div>
        );
      })}
      <div className="small">
        <div>🟢 início • 🟠 órfão (ninguém aponta) • ⚪ normal</div>
      </div>
    </div>
  );
}
