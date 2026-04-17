import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { StructuredTool } from '@langchain/core/tools';
import { ConfiguracaoServidor } from '../tipos';
import { obterFerramentasArquivos, desconectarServidorArquivos } from '../ferramentas/ferramentaArquivos';

export const configuracaoPadrao: ConfiguracaoServidor = {
  nome: 'langgraph-mcp',
  versao: '1.0.0',
  descricao: 'Servidor MCP com LangGraph e OpenRouter para Cursor e Copilot',
};

let ferramentasFilesystem: StructuredTool[] = [];

export async function iniciarServidor(
  configuracao: ConfiguracaoServidor = configuracaoPadrao
): Promise<void> {
  ferramentasFilesystem = await obterFerramentasArquivos('/');

  const servidor = new Server(
    { name: configuracao.nome, version: configuracao.versao },
    { capabilities: { tools: {} } }
  );

  servidor.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'listar_diretorio',
        description:
          'Lista arquivos e subpastas de um diretório. Retorna nome, tipo e caminho de cada entrada.',
        inputSchema: {
          type: 'object' as const,
          properties: {
            caminho: {
              type: 'string',
              description: 'Caminho absoluto do diretório a ser listado',
            },
          },
          required: ['caminho'],
        },
      },
    ],
  }));

  servidor.setRequestHandler(CallToolRequestSchema, async (requisicao) => {
    const { name, arguments: args } = requisicao.params;

    if (name === 'listar_diretorio') {
      const caminho = args?.caminho as string;
      if (!caminho) {
        return { content: [{ type: 'text', text: 'Parâmetro "caminho" é obrigatório.' }] };
      }

      const ferramenta = ferramentasFilesystem.find((f) => f.name === 'list_directory');
      if (!ferramenta) {
        return {
          content: [{ type: 'text', text: 'Ferramenta list_directory não disponível.' }],
          isError: true,
        };
      }

      const resultado = await ferramenta.invoke({ path: caminho });
      return { content: [{ type: 'text', text: resultado as string }] };
    }

    return {
      content: [{ type: 'text', text: `Ferramenta desconhecida: ${name}` }],
      isError: true,
    };
  });

  const transport = new StdioServerTransport();
  await servidor.connect(transport);

  process.on('SIGINT', async () => {
    await desconectarServidorArquivos();
    process.exit(0);
  });
}
