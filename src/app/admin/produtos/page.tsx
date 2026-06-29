"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice, BASE_PATH } from "@/lib/utils";
import { CATEGORIAS, PLATAFORMAS } from "@/types";
import type { Produto, CategoriaKey, PlataformaKey } from "@/types";

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_PATH}/api/produtos`)
      .then((r) => r.json())
      .then(setProdutos)
      .finally(() => setLoading(false));
  }, []);

  async function toggleAtivo(id: string, ativo: number) {
    await fetch(`${BASE_PATH}/api/produtos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo: ativo ? 0 : 1 }),
    });
    setProdutos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ativo: ativo ? 0 : 1 } : p))
    );
  }

  async function deleteProduto(id: string) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    await fetch(`${BASE_PATH}/api/produtos/${id}`, { method: "DELETE" });
    setProdutos((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#e8e8ed] p-5 animate-pulse">
            <div className="h-4 bg-[#f5f5f7] rounded w-1/3 mb-2" />
            <div className="h-3 bg-[#f5f5f7] rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[#86868b]">{produtos.length} produtos</p>
        <Link
          href="/admin/produtos/novo"
          className="bg-[#1d1d1f] text-white px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#2d2d2f] transition-colors"
        >
          Adicionar
        </Link>
      </div>

      {produtos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e8e8ed]">
          <p className="text-[#86868b] text-[14px] mb-3">Nenhum produto cadastrado</p>
          <Link
            href="/admin/produtos/novo"
            className="text-[#1d1d1f] text-[14px] font-medium hover:underline"
          >
            Adicionar primeiro produto
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {produtos.map((produto) => (
            <div key={produto.id} className="bg-white rounded-2xl border border-[#e8e8ed] p-4">
              <div className="flex items-start gap-3">
                {produto.imagem_url ? (
                  <img
                    src={produto.imagem_url}
                    alt={produto.nome}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-[#f5f5f7]"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-[#f5f5f7] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#d2d2d7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium text-[#1d1d1f] text-[14px]">{produto.nome}</h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f5f5f7] text-[#86868b]">
                          {CATEGORIAS[produto.categoria as CategoriaKey] || produto.categoria}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f5f5f7] text-[#86868b]">
                          {PLATAFORMAS[produto.plataforma as PlataformaKey] || produto.plataforma}
                        </span>
                        {produto.preco && (
                          <span className="text-[13px] font-semibold text-[#1d1d1f]">
                            {formatPrice(produto.preco)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => toggleAtivo(produto.id, produto.ativo)}
                        className={cn(
                          "px-3 py-1 rounded-full text-[11px] font-medium transition-colors",
                          produto.ativo
                            ? "bg-[#1d1d1f] text-white"
                            : "bg-[#f5f5f7] text-[#86868b]"
                        )}
                      >
                        {produto.ativo ? "Ativo" : "Inativo"}
                      </button>
                      <button
                        onClick={() => deleteProduto(produto.id)}
                        className="p-1.5 text-[#d2d2d7] hover:text-[#ff3b30] transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
