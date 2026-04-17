/**
 * Grafo Principal — Guardrails → Roteamento → Listagem de Pasta / Mensagem de Segurança
 *
 * Fluxo:
 *   INÍCIO → noGuardrails → (seguro?) → noListarDiretorio → FIM
 *                         → (inseguro?) → noMensagemSeguranca → FIM
 */

import { StateGraph, END, START, Annotation } from '@langchain/langgraph';
import { avaliarGuardrails } from '../agentes/agenteGuardrails';
import { executarAgenteListarDiretorio } from '../agentes/agenteListarDiretorio';

// ─── Estado do Grafo ──────────────────────────────────────────────────────────

const GrafoAnnotation = Annotation.Root({
  prompt: Annotation<string>(),
  seguro: Annotation<boolean | undefined>(),
  razaoGuardrails: Annotation<string | undefined>(),
  resposta: Annotation<string | undefined>(),
});

type Estado = typeof GrafoAnnotation.State;

// ─── Nós do Grafo ─────────────────────────────────────────────────────────────

async function noGuardrails(estado: Estado): Promise<Partial<Estado>> {
  const resultado = await avaliarGuardrails(estado.prompt);
  return {
    seguro: resultado.seguro,
    razaoGuardrails: resultado.razao,
  };
}

async function noListarDiretorio(estado: Estado): Promise<Partial<Estado>> {
  const resposta = await executarAgenteListarDiretorio(estado.prompt);
  return { resposta };
}

function noMensagemSeguranca(estado: Estado): Partial<Estado> {
  return {
    resposta: `[BLOQUEADO] Solicitação rejeitada por motivos de segurança: ${estado.razaoGuardrails ?? 'conteúdo não permitido'}`,
  };
}

// ─── Roteamento Condicional ───────────────────────────────────────────────────

function rotearAposGuardrails(estado: Estado): 'listarDiretorio' | 'mensagemSeguranca' {
  return estado.seguro ? 'listarDiretorio' : 'mensagemSeguranca';
}

// ─── Compilação do Grafo ──────────────────────────────────────────────────────

export function compilarGrafo() {
  return new StateGraph(GrafoAnnotation)
    .addNode('guardrails', noGuardrails)
    .addNode('listarDiretorio', noListarDiretorio)
    .addNode('mensagemSeguranca', noMensagemSeguranca)
    .addEdge(START, 'guardrails')
    .addConditionalEdges('guardrails', rotearAposGuardrails, {
      listarDiretorio: 'listarDiretorio',
      mensagemSeguranca: 'mensagemSeguranca',
    })
    .addEdge('listarDiretorio', END)
    .addEdge('mensagemSeguranca', END)
    .compile();
}

export async function executarGrafo(prompt: string): Promise<string> {
  const grafo = compilarGrafo();
  const resultado = await grafo.invoke({ prompt });
  return resultado.resposta ?? 'Nenhuma resposta gerada';
}
