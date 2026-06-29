"use client";

import { useEffect, useState } from "react";
import { formatPrice, BASE_PATH } from "@/lib/utils";
import { CATEGORIAS, PLATAFORMAS } from "@/types";
import type { Sugestao, CategoriaKey, PlataformaKey } from "@/types";

export default function SugestoesPage() {
  const [sugestoes, setSugestoes] = useState<Sugestao[]>([]);
  const [loading, setLoading] = useState(true);
  const [pesquisando, setPesquisando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [filtro, setFiltro] = useState<"pendente" | "aprovada" | "rejeitada">("pendente");

  function carregarSugestoes() {
    setLoading(true);
    fetch(`${BASE_PATH}/api/sugestoes?status=${filtro}`)
      .then((r) => r.json())
      .then(setSugestoes)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    carregarSugestoes();
  }, [filtro]);

  async function executarPesquisa() {
    setPesquisando(true);
    setMensagem("");
    try {
      const res = await fetch(`${BASE_PATH}/api/pesquisa`, { method: "POST" });
      const data = await res.json();
      setMensagem(data.mensagem || `${data.novas} novos produtos encontrados!`);
      if (filtro === "pendente") carregarSugestoes();
    } catch {
      setMensagem("Erro ao executar pesquisa. Tente novamente.");
    } finally {
      setPesquisando(false);
    }
  }

  async function atualizarStatus(id: string, status: "aprovada" | "rejeitada", linkAfiliado?: string) {
    let link = linkAfiliado;
    if (status === "aprovada" && !link) {
      link = prompt("Cole o link de afiliado para este produto (ou deixe vazio para usar o link original):") || undefined;
    }

    await fetch(`${BASE_PATH}/api/sugestoes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, link_afiliado: link }),
    });

    setSugestoes((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(["pendente", "aprovada", "rejeitada"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFiltro(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filtro === status
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {status === "pendente" ? "Pendentes" : status === "aprovada" ? "Aprovadas" : "Rejeitadas"}
            </button>
          ))}
        </div>

        <button
          onClick={executarPesquisa}
          disabled={pesquisando}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {pesquisando ? (
            <>
              <span className="animate-spin">⏳</span>
              Pesquisando...
            </>
          ) : (
            <>🔍 Pesquisar Produtos</>
          )}
        </button>
      </div>

      {mensagem && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
          {mensagem}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : sugestoes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-3">💡</p>
          <p className="text-gray-500 mb-2">Nenhuma sugestão {filtro}</p>
          {filtro === "pendente" && (
            <p className="text-sm text-gray-400">
              Clique em &quot;Pesquisar Produtos&quot; para buscar novos produtos
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sugestoes.map((sugestao) => (
            <div key={sugestao.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex gap-3">
                  {sugestao.imagem_url ? (
                    <img
                      src={sugestao.imagem_url}
                      alt={sugestao.nome}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-2xl">
                      📦
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">
                      {sugestao.nome}
                    </h3>
                    {sugestao.descricao && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{sugestao.descricao}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {sugestao.preco && (
                        <span className="text-sm font-semibold text-green-600">
                          {formatPrice(sugestao.preco)}
                        </span>
                      )}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {PLATAFORMAS[sugestao.origem as PlataformaKey] || sugestao.origem}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">
                        {CATEGORIAS[sugestao.categoria as CategoriaKey] || sugestao.categoria}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {filtro === "pendente" && (
                <div className="flex border-t border-gray-100">
                  <a
                    href={sugestao.link_original}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 text-center text-sm text-gray-500 hover:bg-gray-50 transition-colors border-r border-gray-100"
                  >
                    Ver Original
                  </a>
                  <button
                    onClick={() => atualizarStatus(sugestao.id, "rejeitada")}
                    className="flex-1 py-2.5 text-center text-sm text-red-500 hover:bg-red-50 transition-colors border-r border-gray-100"
                  >
                    Rejeitar
                  </button>
                  <button
                    onClick={() => atualizarStatus(sugestao.id, "aprovada")}
                    className="flex-1 py-2.5 text-center text-sm text-green-600 font-medium hover:bg-green-50 transition-colors"
                  >
                    Aprovar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
