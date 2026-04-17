/**
 * Ponto de entrada principal da aplicação LangGraph MCP.
 *
 * Carrega as variáveis de ambiente, inicializa as dependências e
 * inicia o servidor MCP via transporte Stdio.
 *
 * TODO: Descomente as importações e chamadas abaixo conforme cada módulo
 * for implementado.
 */

import 'dotenv/config';

// TODO: descomente após implementar cada módulo
// import { carregarConfiguracaoOpenRouter } from './openrouter';
// import { conectarServidorArquivos } from './ferramentas';
// import { compilarGrafo } from './grafo';
// import { iniciarServidor } from './servidor';

async function main(): Promise<void> {
  // TODO: 1. Carregue e valide as variáveis de ambiente
  // const configuracaoLlm = carregarConfiguracaoOpenRouter();

  // TODO: 2. Conecte ao servidor MCP files
  // await conectarServidorArquivos();

  // TODO: 3. Compile o grafo LangGraph
  // const grafo = compilarGrafo();

  // TODO: 4. Inicie o servidor MCP (Stdio para Cursor/Copilot)
  // await iniciarServidor();

  // eslint-disable-next-line no-console
  console.error('[langgraph-mcp] Servidor iniciado e aguardando conexões via Stdio...');
}

main().catch((erro) => {
  // eslint-disable-next-line no-console
  console.error('[langgraph-mcp] Erro fatal:', erro);
  process.exit(1);
});
