import { getDb } from "@/lib/db";
import type { Produto, Configuracao } from "@/types";
import { formatPrice, BASE_PATH } from "@/lib/utils";
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
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-xl mx-auto px-5 py-12">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          {config.avatar_url ? (
            <img
              src={config.avatar_url}
              alt={config.nome_perfil}
              className="w-20 h-20 mx-auto mb-5 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-black flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                {(config.nome_perfil || "V").charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <h1 className="text-xl font-semibold text-[#1d1d1f] tracking-tight">
            {config.nome_perfil || "VendaBio"}
          </h1>
          <p className="text-[#86868b] text-sm mt-1 max-w-xs mx-auto">
            {config.bio || "Produtos que eu testei e recomendo"}
          </p>

          {(config.instagram || config.tiktok) && (
            <div className="flex justify-center gap-5 mt-4">
              {config.instagram && (
                <a href={`https://instagram.com/${config.instagram}`} target="_blank" rel="noopener noreferrer" className="text-[#86868b] hover:text-[#1d1d1f] transition-colors text-sm">
                  Instagram
                </a>
              )}
              {config.tiktok && (
                <a href={`https://tiktok.com/@${config.tiktok}`} target="_blank" rel="noopener noreferrer" className="text-[#86868b] hover:text-[#1d1d1f] transition-colors text-sm">
                  TikTok
                </a>
              )}
              {config.youtube && (
                <a href={`https://youtube.com/@${config.youtube}`} target="_blank" rel="noopener noreferrer" className="text-[#86868b] hover:text-[#1d1d1f] transition-colors text-sm">
                  YouTube
                </a>
              )}
            </div>
          )}
        </header>

        {/* Products */}
        {categorias.map((cat) => {
          const catProdutos = produtos.filter((p) => p.categoria === cat);
          const catLabel = CATEGORIAS[cat as keyof typeof CATEGORIAS] || cat;

          return (
            <section key={cat} className="mb-10">
              <h2 className="text-xs font-medium uppercase tracking-widest text-[#86868b] mb-4">
                {catLabel}
              </h2>
              <div className="space-y-3">
                {catProdutos.map((produto, index) => (
                  <a
                    key={produto.id}
                    href={`${BASE_PATH}/api/cliques/${produto.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block animate-fade-in"
                    style={{ animationDelay: `${index * 60}ms`, animationFillMode: "both" }}
                  >
                    <div className="bg-white rounded-2xl p-4 hover:shadow-lg transition-all duration-300 group cursor-pointer border border-[#e8e8ed]">
                      <div className="flex items-center gap-4">
                        {produto.imagem_url ? (
                          <img
                            src={produto.imagem_url}
                            alt={produto.nome}
                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-[#f5f5f7]"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-[#f5f5f7] flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[#1d1d1f] font-medium text-sm leading-snug line-clamp-2">
                            {produto.nome}
                          </h3>
                          {produto.descricao && (
                            <p className="text-[#86868b] text-xs mt-1 line-clamp-1">
                              {produto.descricao}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1.5">
                            {produto.preco_original && produto.preco && produto.preco_original > produto.preco && (
                              <span className="text-[#86868b] text-xs line-through">
                                {formatPrice(produto.preco_original)}
                              </span>
                            )}
                            {produto.preco && (
                              <span className="text-[#1d1d1f] font-semibold text-sm">
                                {formatPrice(produto.preco)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-[#d2d2d7] group-hover:text-[#1d1d1f] transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
          <div className="text-center py-16">
            <p className="text-[#86868b] text-sm">Em breve.</p>
          </div>
        )}
      </div>
    </div>
  );
}
