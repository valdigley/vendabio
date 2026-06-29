@AGENTS.md

# VendaBio

Plataforma de bio link para venda de produtos via afiliados com curadoria automática e geração de conteúdo.

## Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- SQLite via better-sqlite3 (arquivo `vendabio.db`, auto-criado)
- Sem ORM - queries SQL diretas

## Comandos
- `npm run dev` - servidor de desenvolvimento
- `npm run build` - build de produção
- `npm run lint` - linting

## Estrutura
- `/src/app/page.tsx` - Página pública de bio (vitrine de produtos)
- `/src/app/admin/` - Painel administrativo
- `/src/app/api/` - API routes (produtos, sugestões, cliques, pesquisa, roteiros)
- `/src/lib/db.ts` - Banco de dados SQLite
- `/src/lib/scraper/` - Pesquisa automática de produtos (Mercado Livre API)
- `/src/lib/content/` - Gerador de roteiros para vídeos
- `/src/types/` - Tipos TypeScript compartilhados

## Convenções
- Toda a interface em Português do Brasil
- `better-sqlite3` precisa estar em `serverExternalPackages` no next.config.ts
- Banco cria tabelas automaticamente na primeira conexão
