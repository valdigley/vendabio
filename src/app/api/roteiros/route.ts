import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { gerarRoteiro } from "@/lib/content/script-generator";
import type { Produto } from "@/types";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { produtoId } = body;

  if (!produtoId) {
    return NextResponse.json({ error: "produtoId é obrigatório" }, { status: 400 });
  }

  const db = getDb();
  const produto = db.prepare("SELECT * FROM produtos WHERE id = ?").get(produtoId) as Produto | undefined;

  if (!produto) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }

  const roteiro = gerarRoteiro(produto);
  return NextResponse.json(roteiro);
}
