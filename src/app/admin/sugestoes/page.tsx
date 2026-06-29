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

  const filtros = [
    { key: "pendente" as const, label: "Pendentes" },
    { key: "aprovada" as const, label: "Aprovadas" },
    { key: "rejeitada" as const, label: "Rejeitadas" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5 bg-[#f5f5f7] p-1 rounded-xl">
          {filtros.map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                filtro === f.key
                  ? "bg-white text-[#1d1d1f] shadow-sm"
                  : "text-[#86868b] hover:text-[#1d1d1f]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          onClick={executarPesquisa}
          disabled={pesquisando}
          className="bg-[#1d1d1f] text-white px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#2d2d2f] transition-colors disabled:opacity-40 flex items-center gap-2"
        >
          {pesquisando ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Pesquisando...
            </span>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Pesquisar produtos
            </>
          )}
        </button>
      </div>

      {mensagem && (
        <div className="bg-white border border-[#e8e8ed] text-[#1d1d1f] px-4 py-3 rounded-xl text-[13px]">
          {mensagem}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#e8e8ed] p-5 animate-pulse">
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-[#f5f5f7] rounded-xl" />
                <div className="flex-1">
                  <div className="h-4 bg-[#f5f5f7] rounded w-2/3 mb-2" />
                  <div className="h-3 bg-[#f5f5f7] rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : sugestoes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e8e8ed]">
          <p className="text-[#86868b] text-[14px]">
            {filtro === "pendente" ? "Nenhuma sugestao pendente" : `Nenhuma sugestao ${filtro}`}
          </p>
          {filtro === "pendente" && (
            <p className="text-[13px] text-[#d2d2d7] mt-1">
              Use o botao acima para buscar novos produtos
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sugestoes.map((sugestao) => (
            <div key={sugestao.id} className="bg-white rounded-2xl border border-[#e8e8ed] overflow-hidden">
              <div className="p-4">
                <div className="flex gap-3">
                  {sugestao.imagem_url ? (
                    <img
                      src={sugestao.imagem_url}
                      alt={sugestao.nome}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-[#f5f5f7]"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-[#f5f5f7] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#d2d2d7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[#1d1d1f] text-[14px] leading-tight line-clamp-2">
                      {sugestao.nome}
                    </h3>
                    {sugestao.descricao && (
                      <p className="text-[12px] text-[#86868b] mt-1 line-clamp-1">{sugestao.descricao}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {sugestao.preco && (
                        <span className="text-[13px] font-semibold text-[#1d1d1f]">
                          {formatPrice(sugestao.preco)}
                        </span>
                      )}
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f5f5f7] text-[#86868b]">
                        {PLATAFORMAS[sugestao.origem as PlataformaKey] || sugestao.origem}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f5f5f7] text-[#86868b]">
                        {CATEGORIAS[sugestao.categoria as CategoriaKey] || sugestao.categoria}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {filtro === "pendente" && (
                <div className="flex border-t border-[#e8e8ed]">
                  <a
                    href={sugestao.link_original}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 text-center text-[13px] text-[#86868b] hover:bg-[#f5f5f7] transition-colors border-r border-[#e8e8ed]"
                  >
                    Ver
                  </a>
                  <button
                    onClick={() => atualizarStatus(sugestao.id, "rejeitada")}
                    className="flex-1 py-2.5 text-center text-[13px] text-[#ff3b30] hover:bg-[#f5f5f7] transition-colors border-r border-[#e8e8ed]"
                  >
                    Rejeitar
                  </button>
                  <button
                    onClick={() => atualizarStatus(sugestao.id, "aprovada")}
                    className="flex-1 py-2.5 text-center text-[13px] text-[#1d1d1f] font-medium hover:bg-[#f5f5f7] transition-colors"
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
