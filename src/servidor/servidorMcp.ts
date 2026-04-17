/**
 * Servidor MCP — expõe o grafo LangGraph como ferramentas MCP para
 * o Cursor e o GitHub Copilot consumirem via protocolo MCP.
 *
 * O servidor registra ferramentas que o cliente (Cursor/Copilot) pode invocar.
 * Cada ferramenta recebe parâmetros do chat e devolve a resposta do grafo.
 *
 * TODO: Use o Server do @modelcontextprotocol/sdk para registrar as ferramentas
 * e iniciar o servidor via StdioServerTransport (padrão para Cursor/Copilot).
 *
 * Referências:
 *  - https://modelcontextprotocol.io/docs/concepts/servers
 *  - https://github.com/modelcontextprotocol/typescript-sdk#server
 */

import { ConfiguracaoServidor } from '../tipos';

// TODO: importe Server e StdioServerTransport
// import { Server } from '@modelcontextprotocol/sdk/server/index.js';
// import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
// import {
//   CallToolRequestSchema,
//   ListToolsRequestSchema,
// } from '@modelcontextprotocol/sdk/types.js';

// ─── Configuração Padrão ──────────────────────────────────────────────────────

export const configuracaoPadrao: ConfiguracaoServidor = {
  nome: 'langgraph-mcp',
  versao: '1.0.0',
  descricao: 'Servidor MCP com LangGraph e OpenRouter para Cursor e Copilot',
};

// ─── Criação do Servidor ──────────────────────────────────────────────────────

/**
 * Cria a instância do Server MCP com as capacidades declaradas.
 *
 * TODO: Instancie new Server({ name, version }, { capabilities: { tools: {} } })
 * e configure os handlers de ListTools e CallTool.
 */
export function criarServidorMcp(_configuracao: ConfiguracaoServidor): never {
  // TODO: implemente aqui
  throw new Error('criarServidorMcp: não implementado');
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

/**
 * Handler de listagem de ferramentas — responde ao cliente quais ferramentas
 * estão disponíveis e seus schemas de entrada.
 *
 * TODO: Retorne um array de ToolDefinition descrevendo cada ferramenta exposta.
 * Inclua pelo menos: conversar, lerArquivo, listarDiretorio, buscarEmArquivos.
 */
export function listarFerramentasMcp(): object[] {
  // TODO: implemente aqui
  throw new Error('listarFerramentasMcp: não implementado');
}

/**
 * Handler de chamada de ferramenta — executa a ferramenta solicitada pelo cliente.
 *
 * TODO: Receba o nome da ferramenta e os argumentos, invoque o grafo ou a
 * ferramenta de arquivo correspondente e devolva o resultado no formato MCP.
 */
export async function chamarFerramentaMcp(
  _nome: string,
  _argumentos: Record<string, unknown>
): Promise<object> {
  // TODO: implemente aqui
  throw new Error('chamarFerramentaMcp: não implementado');
}

// ─── Inicialização ────────────────────────────────────────────────────────────

/**
 * Inicia o servidor MCP conectando-o ao transporte Stdio.
 *
 * TODO: Instancie StdioServerTransport e chame server.connect(transport).
 * Adicione tratamento de erros e log de inicialização.
 */
export async function iniciarServidor(): Promise<void> {
  // TODO: implemente aqui
  throw new Error('iniciarServidor: não implementado');
}
