import type { Produto, Roteiro, CategoriaKey } from "@/types";
import { formatPrice } from "@/lib/utils";

const GANCHOS = [
  "Você PRECISA conhecer esse {produto}! 🔥",
  "Achei algo incrível e preciso compartilhar com vocês!",
  "Esse {produto} mudou minha rotina completamente!",
  "Gente, olha essa descoberta! {produto} que vale MUITO a pena!",
  "Vocês me pediram e eu testei: {produto}!",
  "Parei tudo pra mostrar isso pra vocês! 🚀",
  "Se você ainda não tem esse {produto}, tá perdendo!",
  "Finalmente encontrei um {produto} que realmente funciona!",
  "Todo mundo deveria ter esse {produto}! Vou mostrar por quê!",
  "Alerta de produto bom e barato! 🚨",
];

const DEMONSTRACOES: Record<string, string[]> = {
  tecnologia: [
    "Olha o tamanho, o acabamento... a qualidade é impressionante pelo preço. Deixa eu mostrar funcionando...",
    "Conectei rapidinho, sem complicação. Olha como funciona na prática...",
    "Vou fazer o teste real aqui pra vocês verem. Sem cortes, sem edição...",
    "A configuração levou menos de 2 minutos. Agora olha esse resultado...",
  ],
  casa: [
    "Olha como fica organizado! Antes e depois... inacreditável a diferença!",
    "Instalei sozinho em 5 minutos. Olha como ficou bonito e funcional...",
    "Testei por uma semana e posso dizer: vale cada centavo. Vou mostrar...",
    "O material é muito resistente. Tô usando todo dia e continua como novo...",
  ],
  sitio: [
    "Testei na roça e funcionou perfeito! Olha a praticidade...",
    "Quem tem sítio sabe a dificuldade. Esse produto resolveu de vez!",
    "Usei no campo por 30 dias. Vou dar meu veredito honesto...",
    "Trouxe pro sítio e todo mundo quis saber onde comprei!",
  ],
  "solucoes-inteligentes": [
    "Automatizei tudo com esse produto! Olha como funciona pelo celular...",
    "Instalação super simples. Em 10 minutos sua casa fica inteligente!",
    "Funciona com Alexa, Google Home e pelo app. Vou mostrar cada um...",
    "Economia de energia real! Vou mostrar os números antes e depois...",
  ],
};

const CTAS = [
  "Link tá na bio! Corre que esse preço não dura! 🏃‍♂️",
  "Deixei o link na bio com preço especial pra vocês!",
  "Quem quiser, tá tudo na bio! Aproveita que tá em promoção!",
  "Link na bio! Compra pelo meu link que me ajuda demais! ❤️",
  "Clica no link da bio antes que acabe o estoque!",
  "Tá tudo na bio! Me conta depois o que achou!",
];

const DICAS_POR_CATEGORIA: Record<string, string[]> = {
  tecnologia: [
    "Filme o unboxing completo — gera curiosidade",
    "Mostre o produto ao lado de objetos comuns pra dar noção de tamanho",
    "Faça um comparativo rápido com um produto similar mais caro",
    "Grave a tela do celular mostrando o app funcionando",
    "Teste a bateria em tempo real e mostre o resultado",
    "Mostre os acessórios que vêm na caixa",
  ],
  casa: [
    "Filme o antes e depois da organização/instalação",
    "Use iluminação natural para mostrar cores reais",
    "Mostre o produto sendo usado na rotina do dia a dia",
    "Filme de vários ângulos mostrando o acabamento",
    "Compare o espaço antes e depois de usar o produto",
    "Mostre a embalagem e como chegou",
  ],
  sitio: [
    "Filme no ambiente real (roça, horta, curral)",
    "Mostre a durabilidade em condições reais de uso",
    "Compare com a solução antiga/manual",
    "Grave com luz natural do campo — fica bonito e autêntico",
    "Mostre o resultado prático (colheita, organização, etc.)",
    "Se possível, peça pra alguém filmar você usando",
  ],
  "solucoes-inteligentes": [
    "Grave a instalação passo a passo simplificada",
    "Mostre controlando pelo celular em tempo real",
    "Demonstre a automação funcionando (timer, sensor, etc.)",
    "Filme à noite pra mostrar iluminação inteligente",
    "Mostre a economia na conta de luz/água se aplicável",
    "Faça um tour mostrando todos os dispositivos conectados",
  ],
};

const HASHTAGS_BASE = [
  "#LinkNaBio", "#RecomendoDemais", "#AchadosDaInternet",
  "#ProdutoBom", "#ValeAPena", "#Review", "#Testei",
];

const HASHTAGS_CATEGORIA: Record<string, string[]> = {
  tecnologia: ["#Tech", "#Gadgets", "#Tecnologia", "#Inovacao", "#GadgetBarato", "#TechReview"],
  casa: ["#DecoracaoCasa", "#OrganizacaoCasa", "#CasaArrumada", "#DicasDeCasa", "#HomeDecor"],
  sitio: ["#VidaNoSitio", "#VidaNoCampo", "#Agro", "#Fazenda", "#DicasDoSitio", "#VidaRural"],
  "solucoes-inteligentes": ["#CasaInteligente", "#SmartHome", "#Automacao", "#IoT", "#CasaSmart"],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export function gerarRoteiro(produto: Produto): Roteiro {
  const cat = produto.categoria as CategoriaKey;
  const preco = formatPrice(produto.preco);
  const nome = produto.nome;

  const gancho = pick(GANCHOS).replace("{produto}", nome);
  const demos = DEMONSTRACOES[cat] || DEMONSTRACOES.tecnologia;
  const demonstracao = pick(demos);
  const cta = pick(CTAS);

  const dicas = DICAS_POR_CATEGORIA[cat] || DICAS_POR_CATEGORIA.tecnologia;
  const hashtags = [
    ...pickN(HASHTAGS_BASE, 4),
    ...pickN(HASHTAGS_CATEGORIA[cat] || HASHTAGS_CATEGORIA.tecnologia, 4),
  ];

  const precoTexto = preco ? ` por apenas ${preco}` : "";
  const legenda = `${gancho}\n\n${produto.descricao || `Testei o ${nome} e preciso compartilhar com vocês!`}\n\n✅ ${nome}${precoTexto}\n\n👆 Link na bio!\n\n${hashtags.join(" ")}`;

  const titulosSugeridos = [
    `${nome} - Vale a Pena? TESTEI!`,
    `Comprei esse ${nome} e olha no que deu!`,
    `O melhor ${nome} custo-benefício de 2026!`,
    `${nome} - Review HONESTO!`,
    `Achei o ${nome} perfeito${precoTexto}!`,
  ];

  return {
    gancho,
    demonstracao,
    cta,
    dicas_filmagem: pickN(dicas, 4),
    hashtags,
    legenda,
    titulo_video: pick(titulosSugeridos),
  };
}
