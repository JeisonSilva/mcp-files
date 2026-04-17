/**
 * Grafo Principal — fluxo completo com memória SQLite e agente orquestrador.
 *
 * Fluxo:
 *   START
 *     → carregarMemoria   (SQLite: carrega histórico da sessão)
 *     → guardrails        (LLM: avalia segurança do prompt)
 *     → (seguro)  → orquestrador  (LLM: decide ação com base no contexto)
 *                    → (listar_diretorio) → listarDiretorio → salvarMemoria → END
 *                    → (resposta_direta)                   → salvarMemoria → END
 *     → (inseguro) → mensagemSeguranca                     → salvarMemoria → END
 */

import { StateGraph, END, START, Annotation } from '@langchain/langgraph';
import { randomUUID } from 'crypto';
import { avaliarGuardrails } from '../agentes/agenteGuardrails';
import { executarAgenteListarDiretorio } from '../agentes/agenteListarDiretorio';
import { executarOrquestrador } from '../agentes/agenteOrquestrador';
import { MensagemMemoria, carregarHistorico, salvarMensagem } from '../memoria/memoriasSqlite';

// ─── Anotação do Estado ───────────────────────────────────────────────────────

const GrafoAnnotation = Annotation.Root({
  sessionId: Annotation<string>(),
  prompt: Annotation<string>(),
  historico: Annotation<MensagemMemoria[]>(),
  seguro: Annotation<boolean | undefined>(),
  razaoGuardrails: Annotation<string | undefined>(),
  acaoOrquestrador: Annotation<string | undefined>(),
  caminhoOrquestrador: Annotation<string | undefined>(),
  resposta: Annotation<string | undefined>(),
});

type Estado = typeof GrafoAnnotation.State;

// ─── Nós do Grafo ─────────────────────────────────────────────────────────────

async function noCarregarMemoria(estado: Estado): Promise<Partial<Estado>> {
  const historico = carregarHistorico(estado.sessionId);
  return { historico };
}

async function noGuardrails(estado: Estado): Promise<Partial<Estado>> {
  const resultado = await avaliarGuardrails(estado.prompt);
  return {
    seguro: resultado.seguro,
    razaoGuardrails: resultado.razao,
  };
}

async function noOrquestrador(estado: Estado): Promise<Partial<Estado>> {
  const resultado = await executarOrquestrador(estado.prompt, estado.historico ?? []);
  return {
    acaoOrquestrador: resultado.acao,
    caminhoOrquestrador: resultado.caminho,
    resposta: resultado.resposta,
  };
}

async function noListarDiretorio(estado: Estado): Promise<Partial<Estado>> {
  const caminho = estado.caminhoOrquestrador ?? '/';
  const resposta = await executarAgenteListarDiretorio(caminho);
  return { resposta };
}

function noMensagemSeguranca(estado: Estado): Partial<Estado> {
  return {
    resposta: `[BLOQUEADO] Solicitação rejeitada por motivos de segurança: ${estado.razaoGuardrails ?? 'conteúdo não permitido'}`,
  };
}

async function noSalvarMemoria(estado: Estado): Promise<Partial<Estado>> {
  salvarMensagem({ sessionId: estado.sessionId, role: 'user', content: estado.prompt });

  if (estado.resposta) {
    salvarMensagem({
      sessionId: estado.sessionId,
      role: 'assistant',
      content: estado.resposta,
      metadata: {
        seguro: estado.seguro,
        acao: estado.acaoOrquestrador ?? 'mensagem_seguranca',
      },
    });
  }
  return {};
}

// ─── Roteamento Condicional ───────────────────────────────────────────────────

function rotearAposGuardrails(estado: Estado): 'orquestrador' | 'mensagemSeguranca' {
  return estado.seguro ? 'orquestrador' : 'mensagemSeguranca';
}

function rotearAposOrquestrador(estado: Estado): 'listarDiretorio' | 'salvarMemoria' {
  return estado.acaoOrquestrador === 'listar_diretorio' ? 'listarDiretorio' : 'salvarMemoria';
}

// ─── Compilação do Grafo ──────────────────────────────────────────────────────

export function compilarGrafo() {
  return new StateGraph(GrafoAnnotation)
    .addNode('carregarMemoria', noCarregarMemoria)
    .addNode('guardrails', noGuardrails)
    .addNode('orquestrador', noOrquestrador)
    .addNode('listarDiretorio', noListarDiretorio)
    .addNode('mensagemSeguranca', noMensagemSeguranca)
    .addNode('salvarMemoria', noSalvarMemoria)
    .addEdge(START, 'carregarMemoria')
    .addEdge('carregarMemoria', 'guardrails')
    .addConditionalEdges('guardrails', rotearAposGuardrails, {
      orquestrador: 'orquestrador',
      mensagemSeguranca: 'mensagemSeguranca',
    })
    .addConditionalEdges('orquestrador', rotearAposOrquestrador, {
      listarDiretorio: 'listarDiretorio',
      salvarMemoria: 'salvarMemoria',
    })
    .addEdge('listarDiretorio', 'salvarMemoria')
    .addEdge('mensagemSeguranca', 'salvarMemoria')
    .addEdge('salvarMemoria', END)
    .compile();
}

export async function executarGrafo(prompt: string, sessionId?: string): Promise<string> {
  const grafo = compilarGrafo();
  const resultado = await grafo.invoke({
    prompt,
    sessionId: sessionId ?? randomUUID(),
    historico: [],
  });
  return resultado.resposta ?? 'Nenhuma resposta gerada';
}
