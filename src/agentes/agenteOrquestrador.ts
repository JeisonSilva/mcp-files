import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import { MensagemMemoria } from '../memoria/memoriasSqlite';

const PROMPT_SISTEMA = `Você é um agente orquestrador responsável por analisar o histórico de conversas e decidir qual ação executar.

AÇÕES DISPONÍVEIS:
1. "listar_diretorio" — Lista o conteúdo de um diretório.
   Use quando o usuário pedir para listar, mostrar, exibir arquivos ou pastas.
   Extraia o caminho do diretório da solicitação. Se não houver caminho explícito, use "/".

2. "resposta_direta" — Responda diretamente sem ferramentas.
   Use para saudações, perguntas gerais, esclarecimentos ou qualquer coisa que não exija listagem de diretório.

IMPORTANTE:
- Use o histórico de conversas para manter o contexto e evitar respostas repetidas.
- Se o usuário se referir a algo mencionado antes (ex: "aquela pasta"), consulte o histórico.

Responda APENAS com JSON válido, sem texto adicional:
{"acao": "listar_diretorio", "caminho": "/caminho/do/diretorio"}
{"acao": "resposta_direta", "resposta": "sua resposta aqui"}`;

export interface ResultadoOrquestrador {
  acao: 'listar_diretorio' | 'resposta_direta';
  caminho?: string;
  resposta?: string;
}

function criarModelo(): ChatOpenAI {
  return new ChatOpenAI({
    modelName: process.env.OPENROUTER_MODEL ?? 'gpt-4o-mini',
    openAIApiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
      baseURL: process.env.OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1',
    },
    temperature: 0,
  });
}

export async function executarOrquestrador(
  prompt: string,
  historico: MensagemMemoria[]
): Promise<ResultadoOrquestrador> {
  const modelo = criarModelo();

  const mensagens = [
    new SystemMessage(PROMPT_SISTEMA),
    ...historico.map((m) =>
      m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
    ),
    new HumanMessage(prompt),
  ];

  const resultado = await modelo.invoke(mensagens);

  const conteudo =
    typeof resultado.content === 'string'
      ? resultado.content
      : JSON.stringify(resultado.content);

  const jsonMatch = conteudo.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return { acao: 'resposta_direta', resposta: conteudo };
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as ResultadoOrquestrador;
    return parsed;
  } catch {
    return { acao: 'resposta_direta', resposta: conteudo };
  }
}
