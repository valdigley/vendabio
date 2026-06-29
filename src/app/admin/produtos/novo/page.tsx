"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIAS } from "@/types";
import { detectPlatform } from "@/lib/utils";

export default function NovoProdutoPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    preco_original: "",
    imagem_url: "",
    link_afiliado: "",
    categoria: "tecnologia",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome || !form.link_afiliado) return;

    setSaving(true);
    try {
      const plataforma = detectPlatform(form.link_afiliado);
      await fetch("/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          preco: form.preco ? parseFloat(form.preco) : null,
          preco_original: form.preco_original ? parseFloat(form.preco_original) : null,
          plataforma,
        }),
      });
      router.push("/admin/produtos");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Informações do Produto</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link de Afiliado *
            </label>
            <input
              type="url"
              value={form.link_afiliado}
              onChange={(e) => update("link_afiliado", e.target.value)}
              placeholder="https://..."
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {form.link_afiliado && (
              <p className="text-xs text-gray-500 mt-1">
                Plataforma detectada: {detectPlatform(form.link_afiliado)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Produto *
            </label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => update("nome", e.target.value)}
              placeholder="Ex: Fone Bluetooth TWS"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={form.descricao}
              onChange={(e) => update("descricao", e.target.value)}
              placeholder="Descrição curta do produto"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.preco}
                onChange={(e) => update("preco", e.target.value)}
                placeholder="99.90"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço Original (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.preco_original}
                onChange={(e) => update("preco_original", e.target.value)}
                placeholder="149.90"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL da Imagem
            </label>
            <input
              type="url"
              value={form.imagem_url}
              onChange={(e) => update("imagem_url", e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {form.imagem_url && (
              <div className="mt-2">
                <img
                  src={form.imagem_url}
                  alt="Preview"
                  className="w-20 h-20 rounded-lg object-cover border"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              value={form.categoria}
              onChange={(e) => update("categoria", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {Object.entries(CATEGORIAS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || !form.nome || !form.link_afiliado}
            className="bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Salvando..." : "Salvar Produto"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
