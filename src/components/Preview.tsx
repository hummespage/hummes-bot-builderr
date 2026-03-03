import { useMemo, useState } from "react";
import { BotProject } from "../types/bot";

function getNode(bot: BotProject, id: string) {
  const n = bot.nodes.find((x) => x.id === id);
  if (!n) throw new Error("node not found");
  return n;
}

export default function Preview({
  bot,
  brandName,
}: {
  bot: BotProject;
  brandName?: string;
}) {
  const [currentId, setCurrentId] = useState(bot.startNodeId);
  const current = useMemo(() => getNode(bot, currentId), [bot, currentId]);

  return (
    <div className="col">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div className="pill">Preview</div>
        <button className="btn" onClick={() => setCurrentId(bot.startNodeId)}>
          Reiniciar
        </button>
      </div>

      <div className="waPhone">
        <div className="waTop">
          <div className="waAvatar" />
          <div className="waTitle">
            <div className="waName">{brandName || bot.name || "Empresa"}</div>
            <div className="waSub">online</div>
          </div>
        </div>

        <div className="waBody">
          <div className="waBubble bot">{current.message}</div>

          {current.options.length > 0 && (
            <div className="waQuickReplies">
              {current.options.map((o) => (
                <button
                  key={o.id}
                  className="waReply"
                  onClick={() => {
                    if (o.nextNodeId) setCurrentId(o.nextNodeId);
                    else
                      alert(
                        "Fim do fluxo (sem destino).\n\nDica: conecta essa opção a um bloco final."
                      );
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="waComposer">
          <div className="waInput" aria-hidden>
            Mensagem…
          </div>
          <div className="waSend">➤</div>
        </div>
      </div>

      <div className="small">
        Preview visual (estilo WhatsApp). No runtime real tu troca os botões pelo formato da API.
      </div>
    </div>
  );
}
