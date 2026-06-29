import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Sugestao } from "@/types";

export async function GET(request: NextRequest) {
  const db = getDb();
  const status = request.nextUrl.searchParams.get("status") || "pendente";

  const sugestoes = db
    .prepare("SELECT * FROM sugestoes WHERE status = ? ORDER BY criado_em DESC")
    .all(status) as Sugestao[];

  return NextResponse.json(sugestoes);
}
