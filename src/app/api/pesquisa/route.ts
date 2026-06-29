import { NextResponse } from "next/server";
import { executarPesquisa } from "@/lib/scraper";

export async function POST() {
  try {
    const resultado = await executarPesquisa();
    return NextResponse.json({
      sucesso: true,
      mensagem: `Pesquisa concluída! ${resultado.novas} novos produtos encontrados de ${resultado.total} pesquisados.`,
      ...resultado,
    });
  } catch (error) {
    return NextResponse.json(
      { sucesso: false, error: `Erro na pesquisa: ${error}` },
      { status: 500 }
    );
  }
}
