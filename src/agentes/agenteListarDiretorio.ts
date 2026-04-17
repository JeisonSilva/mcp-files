import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
import { obterFerramentasArquivos, desconectarServidorArquivos } from '../ferramentas/ferramentaArquivos';

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

export async function executarAgenteListarDiretorio(caminho: string): Promise<string> {
  const ferramentas = await obterFerramentasArquivos('/');
  const modelo = criarModelo();

  const agente = createReactAgent({
    llm: modelo,
    tools: ferramentas,
  });

  try {
    const resultado = await agente.invoke({
      messages: [new HumanMessage(`Liste o conteúdo do diretório: ${caminho}`)],
    });

    const mensagens = resultado.messages as Array<{ content: unknown }>;
    const ultimaMensagem = mensagens[mensagens.length - 1];
    return typeof ultimaMensagem.content === 'string'
      ? ultimaMensagem.content
      : JSON.stringify(ultimaMensagem.content);
  } finally {
    await desconectarServidorArquivos();
  }
}
