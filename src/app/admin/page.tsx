import { getDb } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const db = getDb();

  const totalProdutos = (db.prepare("SELECT COUNT(*) as count FROM produtos").get() as { count: number }).count;
  const produtosAtivos = (db.prepare("SELECT COUNT(*) as count FROM produtos WHERE ativo = 1").get() as { count: number }).count;
  const sugestoesPendentes = (db.prepare("SELECT COUNT(*) as count FROM sugestoes WHERE status = 'pendente'").get() as { count: number }).count;
  const cliquesHoje = (db.prepare("SELECT COUNT(*) as count FROM cliques WHERE criado_em >= datetime('now', '-1 day')").get() as { count: number }).count;
  const cliquesSemana = (db.prepare("SELECT COUNT(*) as count FROM cliques WHERE criado_em >= datetime('now', '-7 days')").get() as { count: number }).count;
  const cliquesTotal = (db.prepare("SELECT COUNT(*) as count FROM cliques").get() as { count: number }).count;

  const topProdutos = db.prepare(`
    SELECT p.nome, p.id, COUNT(c.id) as total_cliques
    FROM produtos p
    LEFT JOIN cliques c ON c.produto_id = p.id
    GROUP BY p.id
    ORDER BY total_cliques DESC
    LIMIT 5
  `).all() as { nome: string; id: string; total_cliques: number }[];

  const stats = [
    { label: "Produtos ativos", value: produtosAtivos, detail: `${totalProdutos} total`, href: "/admin/produtos" },
    { label: "Cliques hoje", value: cliquesHoje, detail: `${cliquesTotal} total`, href: "/admin/analiticos" },
    { label: "Cliques na semana", value: cliquesSemana, detail: `${cliquesTotal} total`, href: "/admin/analiticos" },
    { label: "Sugestoes pendentes", value: sugestoesPendentes, detail: null, href: "/admin/sugestoes" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white rounded-2xl border border-[#e8e8ed] p-5 hover:shadow-md transition-all group">
            <p className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">{stat.value}</p>
            <p className="text-[13px] text-[#86868b] mt-1">{stat.label}</p>
            {stat.detail && (
              <p className="text-[11px] text-[#d2d2d7] mt-0.5">{stat.detail}</p>
            )}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/produtos/novo"
          className="bg-[#1d1d1f] text-white rounded-2xl p-5 hover:bg-[#2d2d2f] transition-colors"
        >
          <svg className="w-5 h-5 mb-3 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
          <p className="font-semibold text-[15px]">Adicionar produto</p>
          <p className="text-[#86868b] text-[13px] mt-0.5">Cadastrar manualmente</p>
        </Link>

        <Link
          href="/admin/sugestoes"
          className="bg-white rounded-2xl border border-[#e8e8ed] p-5 hover:shadow-md transition-all"
        >
          <svg className="w-5 h-5 mb-3 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="font-semibold text-[15px] text-[#1d1d1f]">Ver sugestoes</p>
          <p className="text-[#86868b] text-[13px] mt-0.5">{sugestoesPendentes} pendentes</p>
        </Link>

        <Link
          href="/admin/roteiros"
          className="bg-white rounded-2xl border border-[#e8e8ed] p-5 hover:shadow-md transition-all"
        >
          <svg className="w-5 h-5 mb-3 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="font-semibold text-[15px] text-[#1d1d1f]">Gerar roteiro</p>
          <p className="text-[#86868b] text-[13px] mt-0.5">Criar conteudo de venda</p>
        </Link>
      </div>

      {topProdutos.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#e8e8ed] p-5">
          <h3 className="text-[13px] font-medium uppercase tracking-widest text-[#86868b] mb-4">Top produtos</h3>
          <div className="space-y-3">
            {topProdutos.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-[13px] font-semibold text-[#d2d2d7] w-5 text-right">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] text-[#1d1d1f] truncate">{p.nome}</p>
                </div>
                <span className="text-[13px] font-medium text-[#86868b]">{p.total_cliques}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
