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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{produtos.length} produtos</p>
        <Link
          href="/admin/produtos/novo"
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          + Adicionar Produto
        </Link>
      </div>

      {produtos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-gray-500 mb-4">Nenhum produto cadastrado</p>
          <Link
            href="/admin/produtos/novo"
            className="text-purple-600 font-medium hover:underline"
          >
            Adicionar primeiro produto
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {produtos.map((produto) => (
            <div key={produto.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start gap-3">
                {produto.imagem_url ? (
                  <img
                    src={produto.imagem_url}
                    alt={produto.nome}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-xl">
                    📦
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">{produto.nome}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                          {CATEGORIAS[produto.categoria as CategoriaKey] || produto.categoria}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {PLATAFORMAS[produto.plataforma as PlataformaKey] || produto.plataforma}
                        </span>
                        {produto.preco && (
                          <span className="text-sm font-semibold text-green-600">
                            {formatPrice(produto.preco)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => toggleAtivo(produto.id, produto.ativo)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          produto.ativo
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {produto.ativo ? "Ativo" : "Inativo"}
                      </button>
                      <button
                        onClick={() => deleteProduto(produto.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        title="Excluir"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
