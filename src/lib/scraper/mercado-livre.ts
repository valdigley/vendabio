import type { ProdutoPesquisado, MercadoLivreSearchResponse } from "./types";

const QUERIES_POR_CATEGORIA: Record<string, string[]> = {
  tecnologia: [
    "gadgets tecnologia mais vendidos",
    "acessorios celular bluetooth",
    "carregador portatil power bank",
    "fone bluetooth sem fio",
    "suporte celular carro",
    "cabo usb tipo c",
  ],
  casa: [
    "organizador casa cozinha",
    "luz led decoracao",
    "suporte parede organizador",
    "utensilios cozinha pratico",
    "limpeza casa inovador",
  ],
  sitio: [
    "ferramentas jardinagem",
    "irrigacao automatica jardim",
    "lampada solar externa",
    "ferramentas multifuncionais campo",
    "cerca eletrica solar",
  ],
  "solucoes-inteligentes": [
    "tomada inteligente wifi",
    "lampada inteligente smart",
    "camera seguranca wifi",
    "sensor presenca inteligente",
    "controle remoto universal wifi",
    "fechadura digital smart",
  ],
};

export async function pesquisarMercadoLivre(): Promise<ProdutoPesquisado[]> {
  const resultados: ProdutoPesquisado[] = [];

  for (const [categoria, queries] of Object.entries(QUERIES_POR_CATEGORIA)) {
    const query = queries[Math.floor(Math.random() * queries.length)];

    try {
      const url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(query)}&limit=10&sort=relevance`;
      const response = await fetch(url);

      if (!response.ok) continue;

      const data: MercadoLivreSearchResponse = await response.json();

      for (const item of data.results) {
        resultados.push({
          nome: item.title,
          descricao: `${item.condition === "new" ? "Novo" : "Usado"} | ${item.sold_quantity} vendidos${item.shipping?.free_shipping ? " | Frete grátis" : ""}`,
          preco: item.price,
          imagemUrl: item.thumbnail?.replace("http://", "https://").replace("-I.jpg", "-O.jpg"),
          linkOriginal: item.permalink,
          origem: "mercadolivre",
          categoria,
        });
      }
    } catch {
      // skip failed requests
    }
  }

  return resultados;
}
