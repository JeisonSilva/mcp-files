/**
 * Ferramentas de acesso a arquivos e pastas via MCP files.
 *
 * Cada função exportada aqui deve ser encapsulada como uma DynamicTool
 * (ou StructuredTool) do LangChain para ser registrada no grafo.
 *
 * TODO: Implemente a comunicação com o servidor MCP files usando o
 * @modelcontextprotocol/sdk (Client) e exponha as ferramentas abaixo.
 *
 * Referências:
 *  - https://github.com/modelcontextprotocol/typescript-sdk
 *  - https://js.langchain.com/docs/how_to/custom_tools
 */

import { ConteudoArquivo, EntradaDiretorio, ResultadoFerramenta } from '../tipos';

// TODO: importe Client e StdioClientTransport de '@modelcontextprotocol/sdk/client/...'
// import { Client } from '@modelcontextprotocol/sdk/client/index.js';

// ─── Conexão com o Servidor MCP Files ────────────────────────────────────────

/**
 * Cria e conecta o cliente MCP ao servidor de arquivos.
 *
 * TODO: Inicialize o Client do SDK com StdioClientTransport ou
 * SSEClientTransport dependendo de como o servidor MCP files é iniciado.
 */
export async function conectarServidorArquivos(): Promise<never> {
  // TODO: implemente aqui
  throw new Error('conectarServidorArquivos: não implementado');
}

// ─── Ferramentas Individuais ──────────────────────────────────────────────────

/**
 * Lê o conteúdo de um arquivo pelo caminho informado.
 *
 * TODO: Chame a ferramenta "read_file" (ou equivalente) no servidor MCP files
 * e mapeie a resposta para ConteudoArquivo.
 */
export async function lerArquivo(
  _caminho: string
): Promise<ResultadoFerramenta<ConteudoArquivo>> {
  // TODO: implemente aqui
  throw new Error('lerArquivo: não implementado');
}

/**
 * Lista entradas de um diretório.
 *
 * TODO: Chame a ferramenta "list_directory" (ou equivalente) no servidor MCP
 * files e mapeie a resposta para EntradaDiretorio[].
 */
export async function listarDiretorio(
  _caminho: string
): Promise<ResultadoFerramenta<EntradaDiretorio[]>> {
  // TODO: implemente aqui
  throw new Error('listarDiretorio: não implementado');
}

/**
 * Escreve conteúdo em um arquivo (cria ou sobrescreve).
 *
 * TODO: Chame a ferramenta "write_file" (ou equivalente) no servidor MCP files.
 */
export async function escreverArquivo(
  _caminho: string,
  _conteudo: string
): Promise<ResultadoFerramenta<void>> {
  // TODO: implemente aqui
  throw new Error('escreverArquivo: não implementado');
}

/**
 * Busca recursiva por padrão de texto nos arquivos de um diretório.
 *
 * TODO: Implemente usando a ferramenta de busca do MCP files ou
 * iterando sobre lerArquivo + listarDiretorio.
 */
export async function buscarEmArquivos(
  _diretorio: string,
  _padrao: string
): Promise<ResultadoFerramenta<ConteudoArquivo[]>> {
  // TODO: implemente aqui
  throw new Error('buscarEmArquivos: não implementado');
}

// ─── Registro das Ferramentas no LangChain ────────────────────────────────────

/**
 * Retorna todas as ferramentas empacotadas como StructuredTool/DynamicTool
 * prontas para serem passadas ao agente ou ao nó do grafo.
 *
 * TODO: Use DynamicStructuredTool de '@langchain/core/tools' para empacotar
 * cada função acima com nome, descrição e schema Zod.
 */
export function obterFerramentasArquivos(): never[] {
  // TODO: implemente aqui
  throw new Error('obterFerramentasArquivos: não implementado');
}
