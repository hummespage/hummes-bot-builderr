import { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { BOT_TEMPLATES, getTemplate } from "./templates";
import { BotProject } from "./types/bot";
import BotList from "./components/BotList";
import NodeTree from "./components/NodeTree";
import NodeEditor from "./components/NodeEditor";
import Preview from "./components/Preview";
import { deleteBot, loadBots, upsertBot } from "./storage/bots";
import { validateBot } from "./utils/validate";
import { HummesLogo } from "./components/HummesLogo";

function now() {
  return Date.now();
}

export default function App() {
  const [bots, setBots] = useState<BotProject[]>([]);
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<
    "dashboard" | "bots" | "whatsapp" | "publish" | "settings"
  >("bots");
  const [lastCreatedBotId, setLastCreatedBotId] = useState<string | null>(null);
  const [activeBotIds, setActiveBotIds] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem("hummes.activeBots") ?? "{}") as Record<
        string,
        boolean
      >;
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const b = loadBots();
    setBots(b);
    if (b[0]) setSelectedBotId(b[0].id);
  }, []);

  useEffect(() => {
    localStorage.setItem("hummes.activeBots", JSON.stringify(activeBotIds));
  }, [activeBotIds]);

  const selectedBot = useMemo(
    () => bots.find((b) => b.id === selectedBotId) ?? null,
    [bots, selectedBotId]
  );

  useEffect(() => {
    if (!selectedBot) return;
    setSelectedNodeId(selectedBot.startNodeId);
  }, [selectedBot?.id]);

  const issues = useMemo(() => (selectedBot ? validateBot(selectedBot) : []), [selectedBot]);

  function createFromTemplate(templateKey: string) {
    const t = getTemplate(templateKey);
    if (!t) return;
    const base = t.create();
    const bot: BotProject = {
      ...base,
      id: uuid(),
      name: `${t.name} • ${new Date().toLocaleDateString("pt-BR")}`,
      createdAt: now(),
      updatedAt: now(),
    };
    const next = [bot, ...bots];
    setBots(next);
    setSelectedBotId(bot.id);
    setActivePage("bots");
    setLastCreatedBotId(bot.id);
    window.setTimeout(() => setLastCreatedBotId(null), 650);
    upsertBot(bot);
  }

  function updateBot(updated: BotProject) {
    const next = bots.map((b) => (b.id === updated.id ? updated : b));
    setBots(next);
    upsertBot(updated);
  }

  function removeBot(id: string) {
    deleteBot(id);
    setActiveBotIds((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    const next = bots.filter((b) => b.id !== id);
    setBots(next);
    setSelectedBotId(next[0]?.id ?? null);
  }

  function exportJSON() {
    if (!selectedBot) return;
    const blob = new Blob([JSON.stringify(selectedBot, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugify(selectedBot.name)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      const f = input.files?.[0];
      if (!f) return;
      const txt = await f.text();
      const obj = JSON.parse(txt) as BotProject;

      // garante id novo pra não sobrescrever sem querer
      const imported: BotProject = {
        ...obj,
        id: uuid(),
        createdAt: now(),
        updatedAt: now(),
        name: obj.name ? `${obj.name} (importado)` : "Bot importado",
      };
      const next = [imported, ...bots];
      setBots(next);
      setSelectedBotId(imported.id);
      upsertBot(imported);
    };
    input.click();
  }

  return (
    <div className="appShell">
      <header className="topbar">
        <div className="topbarLeft">
          <div className="brand">
            <HummesLogo />
            <div className="brandText">
              <div className="brandName">Hummes</div>
              <div className="brandTag">Seu WhatsApp trabalhando por você</div>
            </div>
          </div>
          <div className="pageTitle">
            {activePage === "dashboard" && "Dashboard"}
            {activePage === "bots" && "Bots"}
            {activePage === "whatsapp" && "WhatsApp"}
            {activePage === "publish" && "Publicar"}
            {activePage === "settings" && "Configurações"}
          </div>
        </div>

        <div className="topbarRight">
          <div className="topbarActions">
            <button className="btn" onClick={importJSON}>
              Importar
            </button>
            <button className="btn" onClick={exportJSON} disabled={!selectedBot}>
              Exportar
            </button>
          </div>
          <div className="userChip">
            <div className="userDot" />
            <div>
              <div className="userName">Você</div>
              <div className="userMeta">Hummes 1.0</div>
            </div>
          </div>
        </div>
      </header>

      <aside className="sidebar">
        <button
          className={"navItem " + (activePage === "dashboard" ? "active" : "")}
          onClick={() => setActivePage("dashboard")}
        >
          <span className="navIcon">📊</span>
          Dashboard
        </button>
        <button
          className={"navItem " + (activePage === "bots" ? "active" : "")}
          onClick={() => setActivePage("bots")}
        >
          <span className="navIcon">🤖</span>
          Bots
        </button>
        <button
          className={"navItem " + (activePage === "whatsapp" ? "active" : "")}
          onClick={() => setActivePage("whatsapp")}
        >
          <span className="navIcon">💬</span>
          WhatsApp
        </button>
        <button
          className={"navItem " + (activePage === "publish" ? "active" : "")}
          onClick={() => setActivePage("publish")}
        >
          <span className="navIcon">🚀</span>
          Publicar
        </button>
        <button
          className={"navItem " + (activePage === "settings" ? "active" : "")}
          onClick={() => setActivePage("settings")}
        >
          <span className="navIcon">⚙️</span>
          Configurações
        </button>

        <div className="sidebarFooter">
          <div className="pill">Premium UI • Hummes</div>
        </div>
      </aside>

      <main className="main">
        {activePage === "dashboard" && (
          <div className="content">
            <div className="grid2">
              <div className="card">
                <div className="cardHeader">
                  <div className="cardTitle">Visão rápida</div>
                  <div className="badge">Hoje</div>
                </div>
                <div className="cardBody">
                  <div className="stats">
                    <div className="stat">
                      <div className="statLabel">Bots</div>
                      <div className="statValue">{bots.length}</div>
                    </div>
                    <div className="stat">
                      <div className="statLabel">Ativos</div>
                      <div className="statValue">
                        {Object.values(activeBotIds).filter(Boolean).length}
                      </div>
                    </div>
                    <div className="stat">
                      <div className="statLabel">Templates</div>
                      <div className="statValue">{BOT_TEMPLATES.length}</div>
                    </div>
                  </div>

                  <div className="hr" />

                  <div className="small">
                    Dica: começa criando 1 bot por template e depois só personaliza por cliente.
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="cardHeader">
                  <div className="cardTitle">Ações rápidas</div>
                </div>
                <div className="cardBody">
                  <div className="footerActions">
                    {BOT_TEMPLATES.slice(0, 3).map((t) => (
                      <button
                        key={t.key}
                        className="btn primary"
                        onClick={() => createFromTemplate(t.key)}
                      >
                        + {t.name}
                      </button>
                    ))}
                    <button className="btn" onClick={() => setActivePage("bots")}>
                      Abrir Editor
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePage === "bots" && (
          <div className="content">
            <div className="editorGrid">
              <div className="card">
                <div className="cardHeader">
                  <div className="cardTitle">Meus bots</div>
                  <div className="badge">MVP</div>
                </div>
                <div className="cardBody">
                  <BotList
                    bots={bots}
                    selectedId={selectedBotId}
                    highlightId={lastCreatedBotId}
                    activeBotIds={activeBotIds}
                    onSelect={(id) => setSelectedBotId(id)}
                    onDelete={(id) => removeBot(id)}
                    onToggleActive={(id, isActive) =>
                      setActiveBotIds((prev) => ({ ...prev, [id]: isActive }))
                    }
                  />

                  <div className="hr" />

                  <div className="col">
                    <div style={{ fontWeight: 900 }}>Criar por template</div>
                    {BOT_TEMPLATES.map((t) => (
                      <button
                        key={t.key}
                        className="btn primary"
                        onClick={() => createFromTemplate(t.key)}
                      >
                        + {t.name}
                      </button>
                    ))}
                    <div className="small">Direto ao ponto: cria, ajusta, publica.</div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="cardHeader">
                  <div className="cardTitle">Fluxo</div>
                </div>
                <div className="cardBody">
                  {!selectedBot ? (
                    <div className="small">Crie ou selecione um bot.</div>
                  ) : (
                    <div className="col">
                      <div>
                        <div className="label">Nome do bot</div>
                        <input
                          className="input"
                          value={selectedBot.name}
                          onChange={(e) =>
                            updateBot({ ...selectedBot, name: e.target.value, updatedAt: now() })
                          }
                        />
                        <div className="small">
                          Template: <span className="kbd">{selectedBot.templateKey}</span>
                        </div>
                      </div>

                      <NodeTree
                        bot={selectedBot}
                        selectedNodeId={selectedNodeId ?? selectedBot.startNodeId}
                        onSelectNode={(id) => setSelectedNodeId(id)}
                      />

                      {issues.length > 0 && (
                        <div className="callout">
                          <div className="calloutTitle">Validação</div>
                          {issues.map((i, idx) => (
                            <div
                              key={idx}
                              className={"small " + (i.type === "error" ? "dangerText" : "warnText")}
                            >
                              • {i.message}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="small">Meta: simples, humano e fácil de vender.</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="card">
                <div className="cardHeader">
                  <div className="cardTitle">Editor Premium</div>
                  <div className="badge">Preview WhatsApp</div>
                </div>
                <div className="cardBody">
                  {!selectedBot || !selectedNodeId ? (
                    <div className="small">Selecione um bot e um bloco.</div>
                  ) : (
                    <div className="col" style={{ gap: 14 }}>
                      <NodeEditor
                        bot={selectedBot}
                        selectedNodeId={selectedNodeId}
                        onChange={(b) => updateBot(b)}
                        onSelectNode={(id) => setSelectedNodeId(id)}
                      />

                      <div className="hr" />

                      <Preview bot={selectedBot} brandName={selectedBot.name} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="footerActions" style={{ marginTop: 14 }}>
              <span className="pill">✔ templates prontos</span>
              <span className="pill">✔ árvore simples</span>
              <span className="pill">✔ export/import</span>
              <span className="pill">✔ pronto pra WhatsApp runtime</span>
            </div>
          </div>
        )}

        {activePage === "whatsapp" && (
          <div className="content">
            <div className="grid2">
              <div className="card">
                <div className="cardHeader">
                  <div className="cardTitle">Conectar número</div>
                  <div className="badge">Em breve</div>
                </div>
                <div className="cardBody">
                  <div className="small">
                    Aqui vai entrar a tela de conexão (API oficial), QR code e status do número.
                  </div>
                  <div className="hr" />
                  <div className="row" style={{ gap: 10 }}>
                    <input className="input" placeholder="Ex: +55 48 9xxxx-xxxx" />
                    <button className="btn primary" disabled>
                      Conectar
                    </button>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="cardHeader">
                  <div className="cardTitle">Status</div>
                </div>
                <div className="cardBody">
                  <div className="callout">
                    <div className="calloutTitle">Modo MVP</div>
                    <div className="small">
                      Por enquanto: cria e valida o fluxo. Depois: pluga no runtime e publica.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePage === "publish" && (
          <div className="content">
            <div className="grid2">
              <div className="card">
                <div className="cardHeader">
                  <div className="cardTitle">Publicar bot</div>
                  <div className="badge">1 clique</div>
                </div>
                <div className="cardBody">
                  {!selectedBot ? (
                    <div className="small">Selecione um bot na aba Bots.</div>
                  ) : (
                    <>
                      <div className="small">Bot selecionado</div>
                      <div style={{ fontWeight: 900, fontSize: 16, marginTop: 6 }}>
                        {selectedBot.name}
                      </div>
                      <div className="hr" />

                      <div className="row" style={{ justifyContent: "space-between" }}>
                        <div className="col" style={{ gap: 6 }}>
                          <div style={{ fontWeight: 900 }}>Status</div>
                          <div className="small">
                            {activeBotIds[selectedBot.id] ? "Bot ativo" : "Bot desativado"}
                          </div>
                        </div>
                        <button
                          className={"btn " + (activeBotIds[selectedBot.id] ? "" : "primary")}
                          onClick={() =>
                            setActiveBotIds((prev) => ({
                              ...prev,
                              [selectedBot.id]: !prev[selectedBot.id],
                            }))
                          }
                        >
                          {activeBotIds[selectedBot.id] ? "Desativar" : "Ativar bot"}
                        </button>
                      </div>

                      <div className="publishHint">
                        <div
                          className={"publishCheck " + (activeBotIds[selectedBot.id] ? "on" : "")}
                        >
                          ✓
                        </div>
                        <div>
                          <div style={{ fontWeight: 900 }}>
                            {activeBotIds[selectedBot.id] ? "Bot ativo" : "Pronto pra publicar"}
                          </div>
                          <div className="small">
                            No runtime real, isso liga/desliga o atendimento no número conectado.
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="card">
                <div className="cardHeader">
                  <div className="cardTitle">Checklist</div>
                </div>
                <div className="cardBody">
                  <div className="checklist">
                    <div className="checkItem">
                      <span className="checkDot">•</span>
                      Mensagens claras e curtas
                    </div>
                    <div className="checkItem">
                      <span className="checkDot">•</span>
                      Botões bem nomeados
                    </div>
                    <div className="checkItem">
                      <span className="checkDot">•</span>
                      Fluxo sem pontas soltas
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePage === "settings" && (
          <div className="content">
            <div className="grid2">
              <div className="card">
                <div className="cardHeader">
                  <div className="cardTitle">Interface</div>
                  <div className="badge">Hummes 1.0</div>
                </div>
                <div className="cardBody">
                  <div className="small">
                    Design System aplicado: fundo off-white, cards brancos, radius 14px, micro animações.
                  </div>
                  <div className="hr" />
                  <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
                    <span className="pill">primary: verde</span>
                    <span className="pill">clean UI</span>
                    <span className="pill">zero corporativês</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="cardHeader">
                  <div className="cardTitle">Dados locais</div>
                </div>
                <div className="cardBody">
                  <div className="small">Os bots ficam salvos no seu navegador (localStorage).</div>
                  <div className="hr" />
                  <button
                    className="btn danger"
                    onClick={() => {
                      if (!confirm("Apagar todos os bots e estados locais?")) return;
                      localStorage.removeItem("botsuite.bots.v1");
                      localStorage.removeItem("hummes.activeBots");
                      setBots([]);
                      setSelectedBotId(null);
                      setActiveBotIds({});
                    }}
                  >
                    Limpar tudo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
}
