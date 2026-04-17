/**
 * Tipos e interfaces centrais do projeto LangGraph MCP
 *
 * TODO: Defina aqui os tipos que representam o estado do grafo,
 * configurações do servidor MCP, mensagens e outros contratos de dados.
 */

// ─── Estado do Grafo ──────────────────────────────────────────────────────────

/**
 * Representa o estado compartilhado que flui entre os nós do grafo LangGraph.
 * TODO: Adicione os campos necessários para o seu caso de uso.
 */
export interface EstadoGrafo {
  // Ex.: mensagens: BaseMessage[];
  // Ex.: contextoArquivos: ConteudoArquivo[];
  // Ex.: historico: string[];
}

// ─── Arquivos e Pastas ────────────────────────────────────────────────────────

/**
 * Representa o conteúdo de um arquivo retornado pelo MCP files.
 * TODO: Ajuste os campos conforme o protocolo do seu servidor MCP files.
 */
export interface ConteudoArquivo {
  caminho: string;
  conteudo: string;
  tipo: string;
  tamanhoBytes?: number;
}

/**
 * Representa uma entrada de diretório listada pelo MCP files.
 */
export interface EntradaDiretorio {
  nome: string;
  caminho: string;
  ehDiretorio: boolean;
}

// ─── OpenRouter ───────────────────────────────────────────────────────────────

/**
 * Configuração do cliente OpenRouter.
 * TODO: Adicione campos extras conforme necessário (timeout, headers, etc.).
 */
export interface ConfiguracaoOpenRouter {
  apiKey: string;
  modeloPadrao: string;
  baseUrl: string;
  temperatura?: number;
  maxTokens?: number;
}

// ─── Servidor MCP ─────────────────────────────────────────────────────────────

/**
 * Configuração do servidor MCP.
 * TODO: Expanda com opções de transporte, autenticação, etc.
 */
export interface ConfiguracaoServidor {
  nome: string;
  versao: string;
  descricao?: string;
}

// ─── Ferramentas ──────────────────────────────────────────────────────────────

/**
 * Resultado genérico retornado por uma ferramenta MCP.
 * TODO: Especialize conforme cada ferramenta.
 */
export interface ResultadoFerramenta<T = unknown> {
  sucesso: boolean;
  dados?: T;
  erro?: string;
}
