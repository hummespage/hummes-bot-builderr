import { v4 as uuid } from "uuid";
import { BotNode, BotProject } from "../types/bot";

function byId(bot: BotProject, id: string) {
  const n = bot.nodes.find((x) => x.id === id);
  if (!n) throw new Error("node not found");
  return n;
}

export default function NodeEditor({
  bot,
  selectedNodeId,
  onChange,
  onSelectNode,
}: {
  bot: BotProject;
  selectedNodeId: string;
  onChange: (bot: BotProject) => void;
  onSelectNode: (id: string) => void;
}) {
  const node = byId(bot, selectedNodeId);

  function updateNode(patch: Partial<BotNode>) {
    const nodes = bot.nodes.map((n) => (n.id === node.id ? { ...n, ...patch } : n));
    onChange({ ...bot, nodes, updatedAt: Date.now() });
  }

  function addNode() {
    const newNode: BotNode = {
      id: uuid(),
      title: "Novo bloco",
      message: "Escreva a mensagem aqui…",
      options: [],
    };
    onChange({ ...bot, nodes: [...bot.nodes, newNode], updatedAt: Date.now() });
    onSelectNode(newNode.id);
  }

  function deleteNode() {
    if (bot.nodes.length <= 1) return alert("Não dá pra deletar o último nó.");
    if (node.id === bot.startNodeId) return alert("Não dá pra deletar o nó inicial. Troque o início antes.");

    // Remove opções que apontam pra ele
    const nodes = bot.nodes
      .filter((n) => n.id !== node.id)
      .map((n) => ({
        ...n,
        options: n.options.map((o) => (o.nextNodeId === node.id ? { ...o, nextNodeId: null } : o)),
      }));

    onChange({ ...bot, nodes, updatedAt: Date.now() });

    // Seleciona start
    onSelectNode(bot.startNodeId);
  }

  function setStart() {
    onChange({ ...bot, startNodeId: node.id, updatedAt: Date.now() });
  }

  return (
    <div className="col">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <button className="btn primary" onClick={addNode}>
          + Novo bloco
        </button>
        <div className="row">
          <button className="btn" onClick={setStart} title="Definir como início">
            Definir início
          </button>
          <button className="btn danger" onClick={deleteNode} title="Excluir bloco">
            Excluir
          </button>
        </div>
      </div>

      <div>
        <div className="label">Título do bloco</div>
        <input
          className="input"
          value={node.title}
          onChange={(e) => updateNode({ title: e.target.value })}
          placeholder="Ex: Menu inicial"
        />
      </div>

      <div>
        <div className="label">Mensagem</div>
        <textarea
          className="textarea"
          value={node.message}
          onChange={(e) => updateNode({ message: e.target.value })}
          placeholder="Texto que o bot vai enviar"
        />
        <div className="small">
          Dica: use variáveis tipo <span className="kbd">{"{{empresa}}"}</span> e depois vocês substituem no runtime.
        </div>
      </div>

      <div className="hr" />

      <OptionsEditor bot={bot} node={node} onChange={onChange} />
    </div>
  );
}

function OptionsEditor({
  bot,
  node,
  onChange,
}: {
  bot: BotProject;
  node: BotNode;
  onChange: (bot: BotProject) => void;
}) {
  function updateOptions(options: BotNode["options"]) {
    const nodes = bot.nodes.map((n) => (n.id === node.id ? { ...n, options } : n));
    onChange({ ...bot, nodes, updatedAt: Date.now() });
  }

  function addOption() {
    updateOptions([...node.options, { id: uuid(), label: "Nova opção", nextNodeId: null }]);
  }

  function deleteOption(id: string) {
    updateOptions(node.options.filter((o) => o.id !== id));
  }

  return (
    <div className="col">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div style={{ fontWeight: 900 }}>Opções / Menu</div>
        <button className="btn primary" onClick={addOption}>
          + Adicionar opção
        </button>
      </div>

      {node.options.length === 0 && <div className="small">Sem opções. Esse bloco vira “mensagem final”.</div>}

      <div className="col">
        {node.options.map((o) => (
          <div key={o.id} className="item">
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontWeight: 900 }}>Opção</div>
              <button className="btn danger" onClick={() => deleteOption(o.id)}>
                Remover
              </button>
            </div>

            <div className="col">
              <div>
                <div className="label">Texto</div>
                <input
                  className="input"
                  value={o.label}
                  onChange={(e) => {
                    updateOptions(node.options.map((x) => (x.id === o.id ? { ...x, label: e.target.value } : x)));
                  }}
                />
              </div>

              <div>
                <div className="label">Vai para (destino)</div>
                <select
                  className="select"
                  value={o.nextNodeId ?? ""}
                  onChange={(e) => {
                    const v = e.target.value || null;
                    updateOptions(node.options.map((x) => (x.id === o.id ? { ...x, nextNodeId: v } : x)));
                  }}
                >
                  <option value="">(Sem destino / finaliza)</option>
                  {bot.nodes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}