import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  const db = getDb();
  const dias = parseInt(request.nextUrl.searchParams.get("dias") || "7");

  const topProdutos = db.prepare(`
    SELECT p.nome, p.id, COUNT(c.id) as total
    FROM produtos p
    INNER JOIN cliques c ON c.produto_id = p.id
    WHERE c.criado_em >= datetime('now', '-${dias} days')
    GROUP BY p.id
    ORDER BY total DESC
    LIMIT 10
  `).all();

  const porDia = db.prepare(`
    SELECT DATE(criado_em) as dia, COUNT(*) as total
    FROM cliques
    WHERE criado_em >= datetime('now', '-${dias} days')
    GROUP BY DATE(criado_em)
    ORDER BY dia ASC
  `).all();

  const totalCliques = (db.prepare(`
    SELECT COUNT(*) as count FROM cliques
    WHERE criado_em >= datetime('now', '-${dias} days')
  `).get() as { count: number }).count;

  return NextResponse.json({ topProdutos, porDia, totalCliques });
}
