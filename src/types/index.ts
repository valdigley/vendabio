export interface Produto {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number | null;
  preco_original: number | null;
  imagem_url: string | null;
  link_afiliado: string;
  plataforma: string;
  categoria: string;
  ativo: number;
  ordem: number;
  criado_em: string;
  atualizado_em: string;
}

export interface Sugestao {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number | null;
  imagem_url: string | null;
  link_original: string;
  origem: string;
  categoria: string;
  status: "pendente" | "aprovada" | "rejeitada";
  criado_em: string;
}

export interface Clique {
  id: string;
  produto_id: string;
  ip: string | null;
  user_agent: string | null;
  referer: string | null;
  criado_em: string;
}

export interface Configuracao {
  chave: string;
  valor: string;
}

export interface Roteiro {
  gancho: string;
  demonstracao: string;
  cta: string;
  dicas_filmagem: string[];
  hashtags: string[];
  legenda: string;
  titulo_video: string;
}

export const CATEGORIAS = {
  tecnologia: "Tecnologia",
  casa: "Casa & Decoração",
  sitio: "Sítio & Campo",
  "solucoes-inteligentes": "Soluções Inteligentes",
} as const;

export const PLATAFORMAS = {
  mercadolivre: "Mercado Livre",
  amazon: "Amazon",
  shopee: "Shopee",
  aliexpress: "AliExpress",
  magalu: "Magazine Luiza",
  manual: "Manual",
} as const;

export type CategoriaKey = keyof typeof CATEGORIAS;
export type PlataformaKey = keyof typeof PLATAFORMAS;
