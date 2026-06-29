import { getDb, generateId } from "@/lib/db";
import { pesquisarMercadoLivre } from "./mercado-livre";
import type { ProdutoPesquisado } from "./types";

export async function executarPesquisa(): Promise<{ total: number; novas: number }> {
  const resultados: ProdutoPesquisado[] = [];

  const mlResultados = await pesquisarMercadoLivre();
  resultados.push(...mlResultados);

  const db = getDb();
  const existentes = db
    .prepare("SELECT link_original FROM sugestoes")
    .all() as { link_original: string }[];
  const linksExistentes = new Set(existentes.map((e) => e.link_original));

  const novas = resultados.filter((r) => !linksExistentes.has(r.linkOriginal));

  const insert = db.prepare(`
    INSERT INTO sugestoes (id, nome, descricao, preco, imagem_url, link_original, origem, categoria, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendente')
  `);

  const insertMany = db.transaction((items: ProdutoPesquisado[]) => {
    for (const item of items) {
      insert.run(
        generateId(),
        item.nome,
        item.descricao || null,
        item.preco || null,
        item.imagemUrl || null,
        item.linkOriginal,
        item.origem,
        item.categoria
      );
    }
  });

  insertMany(novas);

  return { total: resultados.length, novas: novas.length };
}
