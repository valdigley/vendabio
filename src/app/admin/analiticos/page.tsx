"use client";

import { useEffect, useState } from "react";

interface ProdutoCliques {
  nome: string;
  id: string;
  total: number;
}

interface CliqueDia {
  dia: string;
  total: number;
}

export default function AnaliticosPage() {
  const [periodo, setPeriodo] = useState<"7" | "30" | "90">("7");
  const [topProdutos, setTopProdutos] = useState<ProdutoCliques[]>([]);
  const [porDia, setPorDia] = useState<CliqueDia[]>([]);
  const [totalCliques, setTotalCliques] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/produtos`)
      .then((r) => r.json())
      .then(async (produtos) => {
        const res = await fetch(`/api/analiticos?dias=${periodo}`);
        if (res.ok) {
          const data = await res.json();
          setTopProdutos(data.topProdutos || []);
          setPorDia(data.porDia || []);
          setTotalCliques(data.totalCliques || 0);
        } else {
          setTopProdutos([]);
          setPorDia([]);
          setTotalCliques(0);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [periodo]);

  const maxCliques = Math.max(...topProdutos.map((p) => p.total), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {(["7", "30", "90"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriodo(p)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              periodo === p
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {p} dias
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Carregando...</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Total de cliques ({periodo} dias)</p>
            <p className="text-3xl font-bold text-gray-900">{totalCliques}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Cliques por Produto</h3>
            {topProdutos.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum clique registrado neste período</p>
            ) : (
              <div className="space-y-3">
                {topProdutos.map((p) => (
                  <div key={p.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 truncate pr-4">{p.nome}</span>
                      <span className="font-semibold text-purple-600 flex-shrink-0">{p.total}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(p.total / maxCliques) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {porDia.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Cliques por Dia</h3>
              <div className="flex items-end gap-1 h-32">
                {porDia.map((d) => {
                  const maxDia = Math.max(...porDia.map((x) => x.total), 1);
                  const height = (d.total / maxDia) * 100;
                  return (
                    <div key={d.dia} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-gray-500">{d.total}</span>
                      <div
                        className="w-full bg-indigo-400 rounded-t min-h-[4px] transition-all duration-500"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-[10px] text-gray-400 truncate w-full text-center">
                        {d.dia.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
