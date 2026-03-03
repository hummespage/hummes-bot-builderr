import { BotProject } from "../types/bot";

export default function BotList({
  bots,
  selectedId,
  highlightId,
  activeBotIds,
  onSelect,
  onDelete,
  onToggleActive,
}: {
  bots: BotProject[];
  selectedId: string | null;
  highlightId?: string | null;
  activeBotIds?: Record<string, boolean>;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive?: (id: string, isActive: boolean) => void;
}) {
  return (
    <div className="list">
      {bots.length === 0 && (
        <div className="item">
          <div style={{ fontWeight: 800 }}>Nenhum bot ainda</div>
          <div className="small">Crie um bot por um template.</div>
        </div>
      )}

      {bots.map((b) => (
        <div
          key={b.id}
          className={
            "item " +
            (b.id === selectedId ? "selected " : "") +
            (highlightId && b.id === highlightId ? "new " : "")
          }
          style={{ cursor: "pointer" }}
          onClick={() => onSelect(b.id)}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
            <div>
              <div style={{ fontWeight: 900 }}>{b.name}</div>
              <div className="small">
                Atualizado: {new Date(b.updatedAt).toLocaleString("pt-BR")}
              </div>
              {activeBotIds && (
                <div className="miniRow" style={{ marginTop: 8 }}>
                  <span className={"statusPill " + (activeBotIds[b.id] ? "on" : "off")}>
                    {activeBotIds[b.id] ? "Bot ativo" : "Desativado"}
                  </span>
                  {onToggleActive && (
                    <button
                      className={"btn tiny " + (activeBotIds[b.id] ? "" : "primary")}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleActive(b.id, !activeBotIds[b.id]);
                      }}
                    >
                      {activeBotIds[b.id] ? "Desativar" : "Ativar"}
                    </button>
                  )}
                </div>
              )}
            </div>
            <button
              className="btn danger"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Excluir este bot?")) onDelete(b.id);
              }}
              title="Excluir"
            >
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
