/**
 * Agente Principal — orquestra o uso das ferramentas e do modelo LLM.
 *
 * No LangGraph, um "agente" é tipicamente um nó que decide quais ferramentas
 * chamar com base na mensagem atual. Use createReactAgent ou monte manualmente
 * com AIMessage + ToolMessage.
 *
 * TODO: Implemente a função criarAgente combinando o modelo OpenRouter com
 * as ferramentas de arquivos.
 *
 * Referências:
 *  - https://langchain-ai.github.io/langgraphjs/
 *  - https://js.langchain.com/docs/how_to/agent_executor
 */

// TODO: importe de '@langchain/langgraph/prebuilt' ou monte manualmente
// import { createReactAgent } from '@langchain/langgraph/prebuilt';

/**
 * Cria o agente LangGraph que une o modelo LLM às ferramentas MCP.
 *
 * @returns Instância do agente pronta para ser usada como nó no grafo
 *
 * TODO: Substitua `never` pelo tipo correto retornado por createReactAgent
 * ou pelo seu agente customizado.
 */
export function criarAgente(): never {
  // TODO: implemente aqui
  throw new Error('criarAgente: não implementado');
}
