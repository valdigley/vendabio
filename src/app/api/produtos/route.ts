import { NextRequest, NextResponse } from "next/server";
import { getDb, generateId } from "@/lib/db";
import type { Produto } from "@/types";

export async function GET(request: NextRequest) {
  const db = getDb();
  const searchParams = request.nextUrl.searchParams;
  const ativo = searchParams.get("ativo");
  const categoria = searchParams.get("categoria");

  let query = "SELECT * FROM produtos";
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (ativo !== null) {
    conditions.push("ativo = ?");
    params.push(ativo === "true" ? 1 : 0);
  }
  if (categoria) {
    conditions.push("categoria = ?");
    params.push(categoria);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }
  query += " ORDER BY ordem ASC, criado_em DESC";

  const produtos = db.prepare(query).all(...params) as Produto[];
  return NextResponse.json(produtos);
}

export async function POST(request: NextRequest) {
  const db = getDb();
  const body = await request.json();

  const { nome, descricao, preco, preco_original, imagem_url, link_afiliado, plataforma, categoria } = body;

  if (!nome || !link_afiliado) {
    return NextResponse.json({ error: "Nome e link de afiliado são obrigatórios" }, { status: 400 });
  }

  const id = generateId();
  const maxOrdem = db.prepare("SELECT MAX(ordem) as max FROM produtos").get() as { max: number | null };

  db.prepare(`
    INSERT INTO produtos (id, nome, descricao, preco, preco_original, imagem_url, link_afiliado, plataforma, categoria, ordem)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    nome,
    descricao || null,
    preco || null,
    preco_original || null,
    imagem_url || null,
    link_afiliado,
    plataforma || "manual",
    categoria || "tecnologia",
    (maxOrdem?.max ?? 0) + 1
  );

  const produto = db.prepare("SELECT * FROM produtos WHERE id = ?").get(id) as Produto;
  return NextResponse.json(produto, { status: 201 });
}
