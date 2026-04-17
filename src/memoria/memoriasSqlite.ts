import Database from 'better-sqlite3';
import path from 'path';

export interface MensagemMemoria {
  id?: number;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
}

let db: Database.Database | null = null;

function obterBancoDados(): Database.Database {
  if (!db) {
    const dbPath = process.env.SQLITE_PATH ?? path.join(process.cwd(), 'memoria.db');
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    inicializarTabelas(db);
  }
  return db;
}

function inicializarTabelas(banco: Database.Database): void {
  banco.exec(`
    CREATE TABLE IF NOT EXISTS mensagens (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      role      TEXT NOT NULL CHECK(role IN ('user','assistant','system')),
      content   TEXT NOT NULL,
      metadata  TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_session_id ON mensagens(session_id);
  `);
}

export function salvarMensagem(mensagem: MensagemMemoria): void {
  const banco = obterBancoDados();
  banco
    .prepare(
      `INSERT INTO mensagens (session_id, role, content, metadata)
       VALUES (?, ?, ?, ?)`
    )
    .run(
      mensagem.sessionId,
      mensagem.role,
      mensagem.content,
      mensagem.metadata ? JSON.stringify(mensagem.metadata) : null
    );
}

export function carregarHistorico(sessionId: string, limite = 20): MensagemMemoria[] {
  const banco = obterBancoDados();
  type Row = {
    id: number;
    sessionId: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    metadata: string | null;
    timestamp: string;
  };
  const rows = banco
    .prepare(
      `SELECT id,
              session_id  AS sessionId,
              role, content, metadata, timestamp
       FROM   mensagens
       WHERE  session_id = ?
       ORDER  BY timestamp ASC
       LIMIT  ?`
    )
    .all(sessionId, limite) as Row[];

  return rows.map((row) => ({
    id: row.id,
    sessionId: row.sessionId,
    role: row.role,
    content: row.content,
    timestamp: row.timestamp,
    metadata: row.metadata
      ? (JSON.parse(row.metadata) as Record<string, unknown>)
      : undefined,
  }));
}

export function limparHistorico(sessionId: string): void {
  const banco = obterBancoDados();
  banco.prepare('DELETE FROM mensagens WHERE session_id = ?').run(sessionId);
}

export function fecharBancoDados(): void {
  if (db) {
    db.close();
    db = null;
  }
}
