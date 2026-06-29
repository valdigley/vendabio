import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Produto } from "@/types";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const produto = db.prepare("SELECT * FROM produtos WHERE id = ?").get(id) as Produto | undefined;

  if (!produto) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }

  return NextResponse.json(produto);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const body = await request.json();

  const produto = db.prepare("SELECT * FROM produtos WHERE id = ?").get(id) as Produto | undefined;
  if (!produto) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }

  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  for (const [key, value] of Object.entries(body)) {
    if (key === "id" || key === "criado_em") continue;
    fields.push(`${key} = ?`);
    values.push(value as string | number | null);
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 400 });
  }

  fields.push("atualizado_em = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE produtos SET ${fields.join(", ")} WHERE id = ?`).run(...values);

  const updated = db.prepare("SELECT * FROM produtos WHERE id = ?").get(id) as Produto;
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();

  const produto = db.prepare("SELECT * FROM produtos WHERE id = ?").get(id) as Produto | undefined;
  if (!produto) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }

  db.prepare("DELETE FROM produtos WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
