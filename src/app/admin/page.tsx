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
    { label: "Produtos Ativos", value: produtosAtivos, total: totalProdutos, color: "bg-blue-500", href: "/admin/produtos" },
    { label: "Cliques Hoje", value: cliquesHoje, total: cliquesTotal, color: "bg-green-500", href: "/admin/analiticos" },
    { label: "Cliques na Semana", value: cliquesSemana, total: cliquesTotal, color: "bg-purple-500", href: "/admin/analiticos" },
    { label: "Sugestões Pendentes", value: sugestoesPendentes, total: null, color: "bg-orange-500", href: "/admin/sugestoes" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className={`w-2 h-2 rounded-full ${stat.color} mb-2`} />
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
            {stat.total !== null && (
              <p className="text-xs text-gray-400 mt-1">de {stat.total} total</p>
            )}
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/produtos/novo"
          className="bg-purple-600 text-white rounded-xl p-4 hover:bg-purple-700 transition-colors flex items-center gap-3"
        >
          <span className="text-2xl">➕</span>
          <div>
            <p className="font-semibold">Adicionar Produto</p>
            <p className="text-purple-200 text-sm">Cadastrar manualmente</p>
          </div>
        </Link>

        <Link
          href="/admin/sugestoes"
          className="bg-orange-500 text-white rounded-xl p-4 hover:bg-orange-600 transition-colors flex items-center gap-3"
        >
          <span className="text-2xl">🔍</span>
          <div>
            <p className="font-semibold">Ver Sugestões</p>
            <p className="text-orange-100 text-sm">{sugestoesPendentes} pendentes</p>
          </div>
        </Link>

        <Link
          href="/admin/roteiros"
          className="bg-indigo-600 text-white rounded-xl p-4 hover:bg-indigo-700 transition-colors flex items-center gap-3"
        >
          <span className="text-2xl">🎬</span>
          <div>
            <p className="font-semibold">Gerar Roteiro</p>
            <p className="text-indigo-200 text-sm">Criar conteúdo de venda</p>
          </div>
        </Link>
      </div>

      {/* Top products */}
      {topProdutos.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Top Produtos por Cliques</h3>
          <div className="space-y-2">
            {topProdutos.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-400 w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{p.nome}</p>
                </div>
                <span className="text-sm font-semibold text-purple-600">{p.total_cliques} cliques</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
