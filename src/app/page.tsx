import { getDb } from "@/lib/db";
import type { Produto, Configuracao } from "@/types";
import { formatPrice } from "@/lib/utils";
import { CATEGORIAS } from "@/types";

export const dynamic = "force-dynamic";

function getConfig(db: ReturnType<typeof getDb>): Record<string, string> {
  const rows = db.prepare("SELECT * FROM configuracoes").all() as Configuracao[];
  const config: Record<string, string> = {};
  for (const row of rows) {
    config[row.chave] = row.valor;
  }
  return config;
}

export default function BioPage() {
  const db = getDb();
  const config = getConfig(db);
  const produtos = db
    .prepare("SELECT * FROM produtos WHERE ativo = 1 ORDER BY ordem ASC, criado_em DESC")
    .all() as Produto[];

  const categorias = [...new Set(produtos.map((p) => p.categoria))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl shadow-lg shadow-orange-500/30">
            {config.avatar_url ? (
              <img
                src={config.avatar_url}
                alt={config.nome_perfil}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              "🛒"
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {config.nome_perfil || "VendaBio"}
          </h1>
          <p className="text-purple-200 text-sm">
            {config.bio || "Produtos incríveis que eu testei e recomendo!"}
          </p>

          <div className="flex justify-center gap-4 mt-3">
            {config.instagram && (
              <a href={`https://instagram.com/${config.instagram}`} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-white transition-colors text-sm">
                @{config.instagram}
              </a>
            )}
            {config.tiktok && (
              <a href={`https://tiktok.com/@${config.tiktok}`} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-white transition-colors text-sm">
                TikTok
              </a>
            )}
          </div>
        </header>

        {categorias.map((cat) => {
          const catProdutos = produtos.filter((p) => p.categoria === cat);
          const catLabel = CATEGORIAS[cat as keyof typeof CATEGORIAS] || cat;

          return (
            <section key={cat} className="mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-purple-300 mb-3 px-1">
                {catLabel}
              </h2>
              <div className="space-y-3">
                {catProdutos.map((produto, index) => (
                  <a
                    key={produto.id}
                    href={`/api/cliques/${produto.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block animate-fade-in"
                    style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
                  >
                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-3 hover:bg-white/20 hover:scale-[1.02] transition-all duration-200 group cursor-pointer">
                      <div className="flex items-center gap-3">
                        {produto.imagem_url ? (
                          <img
                            src={produto.imagem_url}
                            alt={produto.nome}
                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-white/5"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 text-2xl">
                            📦
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium text-sm leading-tight line-clamp-2">
                            {produto.nome}
                          </h3>
                          {produto.descricao && (
                            <p className="text-purple-300 text-xs mt-0.5 line-clamp-1">
                              {produto.descricao}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            {produto.preco_original && produto.preco && produto.preco_original > produto.preco && (
                              <span className="text-purple-400 text-xs line-through">
                                {formatPrice(produto.preco_original)}
                              </span>
                            )}
                            {produto.preco && (
                              <span className="text-yellow-400 font-bold text-sm">
                                {formatPrice(produto.preco)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-white/60 group-hover:text-yellow-400 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          );
        })}

        {produtos.length === 0 && (
          <div className="text-center text-purple-300 py-12">
            <p className="text-4xl mb-3">🛍️</p>
            <p>Novos produtos em breve!</p>
          </div>
        )}

        <footer className="text-center mt-8 pb-4">
          <p className="text-purple-400/50 text-xs">
            Powered by VendaBio
          </p>
        </footer>
      </div>
    </div>
  );
}
