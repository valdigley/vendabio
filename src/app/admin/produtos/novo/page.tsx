"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIAS } from "@/types";
import { detectPlatform, BASE_PATH } from "@/lib/utils";

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
      await fetch(`${BASE_PATH}/api/produtos`, {
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
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl border border-[#e8e8ed] p-6 space-y-5">
          <h2 className="text-[15px] font-semibold text-[#1d1d1f]">Informacoes do produto</h2>

          <div>
            <label className="block text-[13px] font-medium text-[#86868b] mb-1.5">
              Link de afiliado
            </label>
            <input
              type="url"
              value={form.link_afiliado}
              onChange={(e) => update("link_afiliado", e.target.value)}
              placeholder="https://..."
              required
              className="w-full px-3.5 py-2.5 border border-[#e8e8ed] rounded-xl text-[14px] text-[#1d1d1f] focus:ring-2 focus:ring-[#1d1d1f] focus:border-transparent outline-none transition-shadow bg-[#fafafa]"
            />
            {form.link_afiliado && (
              <p className="text-[11px] text-[#86868b] mt-1.5">
                Plataforma: {detectPlatform(form.link_afiliado)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#86868b] mb-1.5">
              Nome do produto
            </label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => update("nome", e.target.value)}
              placeholder="Ex: Fone Bluetooth TWS"
              required
              className="w-full px-3.5 py-2.5 border border-[#e8e8ed] rounded-xl text-[14px] text-[#1d1d1f] focus:ring-2 focus:ring-[#1d1d1f] focus:border-transparent outline-none transition-shadow bg-[#fafafa]"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#86868b] mb-1.5">
              Descricao
            </label>
            <textarea
              value={form.descricao}
              onChange={(e) => update("descricao", e.target.value)}
              placeholder="Descricao curta do produto"
              rows={2}
              className="w-full px-3.5 py-2.5 border border-[#e8e8ed] rounded-xl text-[14px] text-[#1d1d1f] focus:ring-2 focus:ring-[#1d1d1f] focus:border-transparent outline-none transition-shadow resize-none bg-[#fafafa]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-[#86868b] mb-1.5">
                Preco (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.preco}
                onChange={(e) => update("preco", e.target.value)}
                placeholder="99.90"
                className="w-full px-3.5 py-2.5 border border-[#e8e8ed] rounded-xl text-[14px] text-[#1d1d1f] focus:ring-2 focus:ring-[#1d1d1f] focus:border-transparent outline-none transition-shadow bg-[#fafafa]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#86868b] mb-1.5">
                Preco original (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.preco_original}
                onChange={(e) => update("preco_original", e.target.value)}
                placeholder="149.90"
                className="w-full px-3.5 py-2.5 border border-[#e8e8ed] rounded-xl text-[14px] text-[#1d1d1f] focus:ring-2 focus:ring-[#1d1d1f] focus:border-transparent outline-none transition-shadow bg-[#fafafa]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#86868b] mb-1.5">
              URL da imagem
            </label>
            <input
              type="url"
              value={form.imagem_url}
              onChange={(e) => update("imagem_url", e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 border border-[#e8e8ed] rounded-xl text-[14px] text-[#1d1d1f] focus:ring-2 focus:ring-[#1d1d1f] focus:border-transparent outline-none transition-shadow bg-[#fafafa]"
            />
            {form.imagem_url && (
              <div className="mt-2">
                <img
                  src={form.imagem_url}
                  alt="Preview"
                  className="w-16 h-16 rounded-xl object-cover border border-[#e8e8ed]"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#86868b] mb-1.5">
              Categoria
            </label>
            <select
              value={form.categoria}
              onChange={(e) => update("categoria", e.target.value)}
              className="w-full px-3.5 py-2.5 border border-[#e8e8ed] rounded-xl text-[14px] text-[#1d1d1f] focus:ring-2 focus:ring-[#1d1d1f] focus:border-transparent outline-none transition-shadow bg-[#fafafa]"
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
            className="bg-[#1d1d1f] text-white px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-[#2d2d2f] transition-colors disabled:opacity-40"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-full text-[14px] font-medium text-[#86868b] hover:bg-[#f5f5f7] transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
