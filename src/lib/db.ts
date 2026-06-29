import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "vendabio.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initializeDb(db);
  }
  return db;
}

function initializeDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS produtos (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      descricao TEXT,
      preco REAL,
      preco_original REAL,
      imagem_url TEXT,
      link_afiliado TEXT NOT NULL,
      plataforma TEXT DEFAULT 'manual',
      categoria TEXT DEFAULT 'tecnologia',
      ativo INTEGER DEFAULT 1,
      ordem INTEGER DEFAULT 0,
      criado_em TEXT DEFAULT (datetime('now')),
      atualizado_em TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sugestoes (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      descricao TEXT,
      preco REAL,
      imagem_url TEXT,
      link_original TEXT NOT NULL,
      origem TEXT NOT NULL,
      categoria TEXT NOT NULL,
      status TEXT DEFAULT 'pendente',
      criado_em TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS cliques (
      id TEXT PRIMARY KEY,
      produto_id TEXT NOT NULL,
      ip TEXT,
      user_agent TEXT,
      referer TEXT,
      criado_em TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_cliques_produto ON cliques(produto_id);
    CREATE INDEX IF NOT EXISTS idx_cliques_data ON cliques(criado_em);
    CREATE INDEX IF NOT EXISTS idx_sugestoes_status ON sugestoes(status);

    CREATE TABLE IF NOT EXISTS configuracoes (
      chave TEXT PRIMARY KEY,
      valor TEXT NOT NULL
    );

    INSERT OR IGNORE INTO configuracoes (chave, valor) VALUES
      ('nome_perfil', 'VendaBio'),
      ('bio', 'Produtos incríveis que eu testei e recomendo!'),
      ('avatar_url', ''),
      ('instagram', ''),
      ('tiktok', ''),
      ('youtube', '');
  `);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}
