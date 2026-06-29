import { NextRequest, NextResponse } from "next/server";
import { getDb, generateId } from "@/lib/db";
import type { Sugestao, Produto } from "@/types";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const body = await request.json();
  const { status, link_afiliado } = body;

  const sugestao = db.prepare("SELECT * FROM sugestoes WHERE id = ?").get(id) as Sugestao | undefined;
  if (!sugestao) {
    return NextResponse.json({ error: "Sugestão não encontrada" }, { status: 404 });
  }

  db.prepare("UPDATE sugestoes SET status = ? WHERE id = ?").run(status, id);

  if (status === "aprovada") {
    const produtoId = generateId();
    const maxOrdem = db.prepare("SELECT MAX(ordem) as max FROM produtos").get() as { max: number | null };

    db.prepare(`
      INSERT INTO produtos (id, nome, descricao, preco, imagem_url, link_afiliado, plataforma, categoria, ordem)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      produtoId,
      sugestao.nome,
      sugestao.descricao,
      sugestao.preco,
      sugestao.imagem_url,
      link_afiliado || sugestao.link_original,
      sugestao.origem,
      sugestao.categoria,
      (maxOrdem?.max ?? 0) + 1
    );

    const produto = db.prepare("SELECT * FROM produtos WHERE id = ?").get(produtoId) as Produto;
    return NextResponse.json({ sugestao: { ...sugestao, status }, produto });
  }

  return NextResponse.json({ sugestao: { ...sugestao, status } });
}
