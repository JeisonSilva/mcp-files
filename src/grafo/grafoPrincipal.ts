/**
 * Grafo Principal — define os nós, arestas e fluxo de execução do LangGraph.
 *
 * O StateGraph é o coração da aplicação. Cada nó processa o estado e decide
 * o próximo passo. Use arestas condicionais para rotear entre ferramentas,
 * agente e fim da execução.
 *
 * TODO: Construa o StateGraph com os nós abaixo e compile o grafo.
 *
 * Fluxo sugerido:
 *   INÍCIO → nóAgente → (precisa de ferramenta?) → nóFerramentas → nóAgente
 *                                                 → (não precisa) → FIM
 *
 * Referências:
 *  - https://langchain-ai.github.io/langgraphjs/concepts/low_level/
 *  - https://langchain-ai.github.io/langgraphjs/how-tos/define-graph/
 */

import { EstadoGrafo } from '../tipos';

// TODO: importe StateGraph, END, START de '@langchain/langgraph'
// import { StateGraph, END, START } from '@langchain/langgraph';

// ─── Nós do Grafo ─────────────────────────────────────────────────────────────

/**
 * Nó do agente: chama o LLM e decide a próxima ação.
 *
 * TODO: Invoque criarAgente() e passe o estado atual.
 * Retorne o estado atualizado com a resposta do modelo.
 */
export async function noAgente(_estado: EstadoGrafo): Promise<Partial<EstadoGrafo>> {
  // TODO: implemente aqui
  throw new Error('noAgente: não implementado');
}

/**
 * Nó de ferramentas: executa as ferramentas solicitadas pelo agente.
 *
 * TODO: Leia as chamadas de ferramenta do estado, execute-as via
 * obterFerramentasArquivos() e retorne o estado com os resultados.
 */
export async function noFerramentas(_estado: EstadoGrafo): Promise<Partial<EstadoGrafo>> {
  // TODO: implemente aqui
  throw new Error('noFerramentas: não implementado');
}

// ─── Roteamento Condicional ───────────────────────────────────────────────────

/**
 * Decide para qual nó ir após o agente processar o estado.
 *
 * TODO: Se o agente solicitou chamadas de ferramenta, retorne 'ferramentas'.
 * Caso contrário, retorne END para encerrar o ciclo.
 */
export function rotearAposAgente(_estado: EstadoGrafo): string {
  // TODO: implemente aqui
  throw new Error('rotearAposAgente: não implementado');
}

// ─── Compilação do Grafo ──────────────────────────────────────────────────────

/**
 * Monta e compila o StateGraph completo.
 *
 * TODO: Instancie StateGraph<EstadoGrafo>, adicione os nós e arestas,
 * configure o ponto de entrada e compile com .compile().
 *
 * @returns Grafo compilado pronto para ser invocado pelo servidor MCP
 */
export function compilarGrafo(): never {
  // TODO: implemente aqui
  throw new Error('compilarGrafo: não implementado');
}
