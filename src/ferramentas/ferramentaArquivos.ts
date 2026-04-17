import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { StructuredTool } from '@langchain/core/tools';

let clienteGlobal: MultiServerMCPClient | null = null;

export async function conectarServidorArquivos(raiz: string = '/'): Promise<MultiServerMCPClient> {
  if (clienteGlobal) return clienteGlobal;

  clienteGlobal = new MultiServerMCPClient({
    filesystem: {
      transport: 'stdio',
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', raiz],
    },
  });

  return clienteGlobal;
}

export async function obterFerramentasArquivos(raiz: string = '/'): Promise<StructuredTool[]> {
  const cliente = await conectarServidorArquivos(raiz);
  return cliente.getTools() as Promise<StructuredTool[]>;
}

export async function desconectarServidorArquivos(): Promise<void> {
  if (clienteGlobal) {
    await clienteGlobal.close();
    clienteGlobal = null;
  }
}
