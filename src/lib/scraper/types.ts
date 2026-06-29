export interface ProdutoPesquisado {
  nome: string;
  descricao?: string;
  preco?: number;
  imagemUrl?: string;
  linkOriginal: string;
  origem: "mercadolivre" | "aliexpress" | "shopee" | "amazon";
  categoria: string;
}

export interface MercadoLivreSearchResult {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  permalink: string;
  condition: string;
  sold_quantity: number;
  available_quantity: number;
  shipping: {
    free_shipping: boolean;
  };
}

export interface MercadoLivreSearchResponse {
  results: MercadoLivreSearchResult[];
  paging: {
    total: number;
    offset: number;
    limit: number;
  };
}
