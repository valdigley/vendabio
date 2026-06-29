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
    <div className="max-w-3xl space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-3">Gerar Roteiro de Venda</h2>
        <p className="text-sm text-gray-500 mb-4">
          Selecione um produto e gere roteiros, dicas de filmagem, hashtags e legendas para seus vídeos de venda.
        </p>

        <div className="flex gap-3">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Selecione um produto...</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
          <button
            onClick={gerarRoteiro}
            disabled={!selectedId || loading}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? "Gerando..." : "Gerar Roteiro"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-2xl animate-pulse-slow">🎬</p>
          <p className="text-gray-500 mt-2">Gerando roteiro...</p>
        </div>
      )}

      {roteiro && (
        <div className="space-y-4 animate-fade-in">
          {/* Título do vídeo */}
          <Section
            title="Título para o Vídeo"
            icon="🎯"
            content={roteiro.titulo_video}
            onCopy={() => copiar(roteiro.titulo_video, "titulo")}
            copied={copied === "titulo"}
          />

          {/* Roteiro */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>🎬</span> Roteiro do Vídeo
              </h3>
              <button
                onClick={() => copiar(`${roteiro.gancho}\n\n${roteiro.demonstracao}\n\n${roteiro.cta}`, "roteiro")}
                className="text-xs text-purple-600 hover:text-purple-800 font-medium"
              >
                {copied === "roteiro" ? "Copiado!" : "Copiar tudo"}
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                <p className="text-xs font-semibold text-yellow-700 mb-1">GANCHO (primeiros 3 segundos)</p>
                <p className="text-sm text-gray-800">{roteiro.gancho}</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <p className="text-xs font-semibold text-blue-700 mb-1">DEMONSTRAÇÃO</p>
                <p className="text-sm text-gray-800">{roteiro.demonstracao}</p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                <p className="text-xs font-semibold text-green-700 mb-1">CTA (chamada para ação)</p>
                <p className="text-sm text-gray-800">{roteiro.cta}</p>
              </div>
            </div>
          </div>

          {/* Dicas */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <span>💡</span> Dicas de Filmagem
            </h3>
            <ul className="space-y-2">
              {roteiro.dicas_filmagem.map((dica, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-purple-500 mt-0.5">•</span>
                  {dica}
                </li>
              ))}
            </ul>
          </div>

          {/* Hashtags */}
          <Section
            title="Hashtags"
            icon="#️⃣"
            content={roteiro.hashtags.join(" ")}
            onCopy={() => copiar(roteiro.hashtags.join(" "), "hashtags")}
            copied={copied === "hashtags"}
          />

          {/* Legenda */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>📝</span> Legenda para Post
              </h3>
              <button
                onClick={() => copiar(roteiro.legenda, "legenda")}
                className="text-xs text-purple-600 hover:text-purple-800 font-medium"
              >
                {copied === "legenda" ? "Copiado!" : "Copiar"}
              </button>
            </div>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans bg-gray-50 rounded-lg p-3">
              {roteiro.legenda}
            </pre>
          </div>

          {/* Regenerate */}
          <button
            onClick={gerarRoteiro}
            className="w-full py-2.5 text-sm text-purple-600 font-medium border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
          >
            🔄 Gerar Outro Roteiro
          </button>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  icon,
  content,
  onCopy,
  copied,
}: {
  title: string;
  icon: string;
  content: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <span>{icon}</span> {title}
        </h3>
        <button
          onClick={onCopy}
          className="text-xs text-purple-600 hover:text-purple-800 font-medium"
        >
          {copied ? "Copiado!" : "Copiar"}
        </button>
      </div>
      <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{content}</p>
    </div>
  );
}
