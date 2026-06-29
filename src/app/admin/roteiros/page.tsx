"use client";

import { useEffect, useState } from "react";
import { BASE_PATH } from "@/lib/utils";
import type { Produto, Roteiro } from "@/types";

export default function RoteirosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [roteiro, setRoteiro] = useState<Roteiro | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    fetch(`${BASE_PATH}/api/produtos?ativo=true`)
      .then((r) => r.json())
      .then(setProdutos);
  }, []);

  async function gerarRoteiro() {
    if (!selectedId) return;
    setLoading(true);
    setRoteiro(null);
    try {
      const res = await fetch(`${BASE_PATH}/api/roteiros`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produtoId: selectedId }),
      });
      const data = await res.json();
      setRoteiro(data);
    } finally {
      setLoading(false);
    }
  }

  function copiar(texto: string, label: string) {
    navigator.clipboard.writeText(texto);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div className="bg-white rounded-2xl border border-[#e8e8ed] p-6">
        <h2 className="text-[15px] font-semibold text-[#1d1d1f] mb-1">Gerar roteiro de venda</h2>
        <p className="text-[13px] text-[#86868b] mb-5">
          Selecione um produto para gerar roteiro, dicas de filmagem, hashtags e legendas.
        </p>

        <div className="flex gap-3">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="flex-1 px-3.5 py-2.5 border border-[#e8e8ed] rounded-xl text-[14px] text-[#1d1d1f] focus:ring-2 focus:ring-[#1d1d1f] focus:border-transparent outline-none bg-[#fafafa]"
          >
            <option value="">Selecione um produto...</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
          <button
            onClick={gerarRoteiro}
            disabled={!selectedId || loading}
            className="bg-[#1d1d1f] text-white px-5 py-2.5 rounded-full text-[14px] font-medium hover:bg-[#2d2d2f] transition-colors disabled:opacity-40 whitespace-nowrap"
          >
            {loading ? "Gerando..." : "Gerar"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl border border-[#e8e8ed] p-10 text-center">
          <svg className="animate-spin w-6 h-6 mx-auto text-[#86868b]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-[#86868b] text-[14px] mt-3">Gerando roteiro...</p>
        </div>
      )}

      {roteiro && (
        <div className="space-y-4">
          <TextBlock
            label="Titulo do video"
            content={roteiro.titulo_video}
            onCopy={() => copiar(roteiro.titulo_video, "titulo")}
            copied={copied === "titulo"}
          />

          <div className="bg-white rounded-2xl border border-[#e8e8ed] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-medium uppercase tracking-widest text-[#86868b]">Roteiro</h3>
              <CopyBtn
                onClick={() => copiar(`${roteiro.gancho}\n\n${roteiro.demonstracao}\n\n${roteiro.cta}`, "roteiro")}
                copied={copied === "roteiro"}
              />
            </div>
            <div className="space-y-3">
              <div className="bg-[#fafafa] rounded-xl p-4 border border-[#e8e8ed]">
                <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1.5">Gancho</p>
                <p className="text-[14px] text-[#1d1d1f] leading-relaxed">{roteiro.gancho}</p>
              </div>
              <div className="bg-[#fafafa] rounded-xl p-4 border border-[#e8e8ed]">
                <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1.5">Demonstracao</p>
                <p className="text-[14px] text-[#1d1d1f] leading-relaxed">{roteiro.demonstracao}</p>
              </div>
              <div className="bg-[#fafafa] rounded-xl p-4 border border-[#e8e8ed]">
                <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1.5">CTA</p>
                <p className="text-[14px] text-[#1d1d1f] leading-relaxed">{roteiro.cta}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e8e8ed] p-5">
            <h3 className="text-[13px] font-medium uppercase tracking-widest text-[#86868b] mb-3">Dicas de filmagem</h3>
            <ul className="space-y-2">
              {roteiro.dicas_filmagem.map((dica, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[14px] text-[#1d1d1f]">
                  <span className="text-[#d2d2d7] mt-0.5 text-[10px]">&#9679;</span>
                  {dica}
                </li>
              ))}
            </ul>
          </div>

          <TextBlock
            label="Hashtags"
            content={roteiro.hashtags.join(" ")}
            onCopy={() => copiar(roteiro.hashtags.join(" "), "hashtags")}
            copied={copied === "hashtags"}
          />

          <div className="bg-white rounded-2xl border border-[#e8e8ed] p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-medium uppercase tracking-widest text-[#86868b]">Legenda</h3>
              <CopyBtn onClick={() => copiar(roteiro.legenda, "legenda")} copied={copied === "legenda"} />
            </div>
            <pre className="text-[14px] text-[#1d1d1f] whitespace-pre-wrap font-sans bg-[#fafafa] rounded-xl p-4 border border-[#e8e8ed]">
              {roteiro.legenda}
            </pre>
          </div>

          <button
            onClick={gerarRoteiro}
            className="w-full py-2.5 text-[14px] text-[#86868b] font-medium border border-[#e8e8ed] rounded-full hover:bg-[#f5f5f7] transition-colors"
          >
            Gerar outro roteiro
          </button>
        </div>
      )}
    </div>
  );
}

function TextBlock({ label, content, onCopy, copied }: { label: string; content: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e8e8ed] p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[13px] font-medium uppercase tracking-widest text-[#86868b]">{label}</h3>
        <CopyBtn onClick={onCopy} copied={copied} />
      </div>
      <p className="text-[14px] text-[#1d1d1f] bg-[#fafafa] rounded-xl p-4 border border-[#e8e8ed]">{content}</p>
    </div>
  );
}

function CopyBtn({ onClick, copied }: { onClick: () => void; copied: boolean }) {
  return (
    <button onClick={onClick} className="text-[12px] text-[#86868b] hover:text-[#1d1d1f] font-medium transition-colors">
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}
