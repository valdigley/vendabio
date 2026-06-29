"use client";

import { useEffect, useState } from "react";
import { BASE_PATH } from "@/lib/utils";

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
    fetch(`${BASE_PATH}/api/produtos`)
      .then((r) => r.json())
      .then(async () => {
        const res = await fetch(`${BASE_PATH}/api/analiticos?dias=${periodo}`);
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
    <div className="space-y-5">
      <div className="flex gap-1.5 bg-[#f5f5f7] p-1 rounded-xl w-fit">
        {(["7", "30", "90"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriodo(p)}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              periodo === p
                ? "bg-white text-[#1d1d1f] shadow-sm"
                : "text-[#86868b] hover:text-[#1d1d1f]"
            }`}
          >
            {p} dias
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-[#e8e8ed] p-10 text-center">
          <p className="text-[#86868b] text-[14px]">Carregando...</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-[#e8e8ed] p-6">
            <p className="text-[13px] text-[#86868b]">Total de cliques</p>
            <p className="text-[36px] font-semibold text-[#1d1d1f] tracking-tight">{totalCliques}</p>
            <p className="text-[12px] text-[#d2d2d7]">ultimos {periodo} dias</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e8e8ed] p-6">
            <h3 className="text-[13px] font-medium uppercase tracking-widest text-[#86868b] mb-5">Por produto</h3>
            {topProdutos.length === 0 ? (
              <p className="text-[14px] text-[#86868b]">Nenhum clique registrado</p>
            ) : (
              <div className="space-y-4">
                {topProdutos.map((p) => (
                  <div key={p.id}>
                    <div className="flex justify-between text-[13px] mb-1.5">
                      <span className="text-[#1d1d1f] truncate pr-4">{p.nome}</span>
                      <span className="font-semibold text-[#1d1d1f] flex-shrink-0">{p.total}</span>
                    </div>
                    <div className="w-full bg-[#f5f5f7] rounded-full h-1.5">
                      <div
                        className="bg-[#1d1d1f] h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${(p.total / maxCliques) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {porDia.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#e8e8ed] p-6">
              <h3 className="text-[13px] font-medium uppercase tracking-widest text-[#86868b] mb-5">Por dia</h3>
              <div className="flex items-end gap-1 h-32">
                {porDia.map((d) => {
                  const maxDia = Math.max(...porDia.map((x) => x.total), 1);
                  const height = (d.total / maxDia) * 100;
                  return (
                    <div key={d.dia} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[11px] text-[#86868b]">{d.total}</span>
                      <div
                        className="w-full bg-[#1d1d1f] rounded-t min-h-[4px] transition-all duration-500"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-[10px] text-[#d2d2d7] truncate w-full text-center">
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
