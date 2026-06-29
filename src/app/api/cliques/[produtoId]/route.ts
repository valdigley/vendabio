import { NextRequest, NextResponse } from "next/server";
import { getDb, generateId } from "@/lib/db";
import type { Produto } from "@/types";

export async function GET(request: NextRequest, { params }: { params: Promise<{ produtoId: string }> }) {
  const { produtoId } = await params;
  const db = getDb();

  const produto = db.prepare("SELECT * FROM produtos WHERE id = ? AND ativo = 1").get(produtoId) as Produto | undefined;

  if (!produto) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent") || "";
  const referer = request.headers.get("referer") || "";

  db.prepare(`
    INSERT INTO cliques (id, produto_id, ip, user_agent, referer)
    VALUES (?, ?, ?, ?, ?)
  `).run(generateId(), produtoId, ip, userAgent, referer);

  return NextResponse.redirect(produto.link_afiliado);
}
