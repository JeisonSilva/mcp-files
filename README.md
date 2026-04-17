# langgraph-mcp

Servidor **MCP** (Model Context Protocol) construído com **LangGraph** e **TypeScript** que expõe ferramentas de acesso a arquivos para o **Cursor** e o **GitHub Copilot**. A comunicação com os modelos de linguagem é feita via **OpenRouter**.

---

## Arquitetura

```
Cursor / Copilot (cliente MCP)
        │  Stdio (MCP Protocol)
        ▼
┌─────────────────────────────────┐
│         Servidor MCP            │  src/servidor/
│  (ListTools / CallTool handlers)│
└────────────┬────────────────────┘
             │ invoca
             ▼
┌─────────────────────────────────┐
│       Grafo LangGraph           │  src/grafo/
│  nóAgente ⇄ nóFerramentas       │
└──────┬──────────────┬───────────┘
       │              │
       ▼              ▼
┌────────────┐  ┌─────────────────┐
│ OpenRouter │  │  MCP Files      │  src/openrouter/ / src/ferramentas/
│ (LLM via   │  │ (read/write/    │
│ ChatOpenAI)│  │  list/search)   │
└────────────┘  └─────────────────┘
```

---

## Estrutura do Projeto

```
langgraph-mcp/
├── src/
│   ├── tipos/                  # Interfaces e tipos TypeScript
│   │   └── index.ts
│   ├── openrouter/             # Cliente OpenRouter (LLM)
│   │   ├── clienteOpenrouter.ts
│   │   └── index.ts
│   ├── ferramentas/            # Ferramentas MCP files (ler/escrever/listar)
│   │   ├── ferramentaArquivos.ts
│   │   └── index.ts
│   ├── agentes/                # Agente LangGraph (LLM + ferramentas)
│   │   ├── agentePrincipal.ts
│   │   └── index.ts
│   ├── grafo/                  # StateGraph (nós, arestas, roteamento)
│   │   ├── grafoPrincipal.ts
│   │   └── index.ts
│   ├── servidor/               # Servidor MCP (Stdio transport)
│   │   ├── servidorMcp.ts
│   │   └── index.ts
│   └── index.ts                # Ponto de entrada principal
├── .env.example                # Variáveis de ambiente necessárias
├── package.json
├── tsconfig.json
└── README.md
```

---

## Pré-requisitos

- **Node.js** >= 20
- **npm** >= 10
- Conta no [OpenRouter](https://openrouter.ai) com chave de API
- Servidor MCP files (ex.: `@modelcontextprotocol/server-filesystem`)

---

## Instalação

```bash
npm install
```

---

## Configuração

```bash
cp .env.example .env
# Edite .env e preencha OPENROUTER_API_KEY e demais variáveis
```

---

## Passo a Passo de Implementação

Implemente cada módulo na ordem abaixo. Cada arquivo contém comentários `TODO` detalhados.

### 1. `src/tipos/index.ts`
Revise e expanda as interfaces conforme o seu caso de uso.

### 2. `src/openrouter/clienteOpenrouter.ts`
- Importe `ChatOpenAI` de `@langchain/openai`
- Em `criarClienteOpenRouter`: instancie `ChatOpenAI` com `configuration.baseURL` apontando para `https://openrouter.ai/api/v1` e o `apiKey` do OpenRouter
- Em `carregarConfiguracaoOpenRouter`: leia as variáveis de ambiente e valide com Zod

### 3. `src/ferramentas/ferramentaArquivos.ts`
- Importe `Client` e `StdioClientTransport` de `@modelcontextprotocol/sdk`
- Em `conectarServidorArquivos`: inicialize e conecte o cliente ao servidor MCP files
- Implemente `lerArquivo`, `listarDiretorio`, `escreverArquivo`, `buscarEmArquivos` chamando as ferramentas MCP correspondentes
- Em `obterFerramentasArquivos`: empacote cada função como `DynamicStructuredTool` com schema Zod

### 4. `src/agentes/agentePrincipal.ts`
- Importe `createReactAgent` de `@langchain/langgraph/prebuilt`
- Em `criarAgente`: chame `createReactAgent` passando o modelo e as ferramentas

### 5. `src/grafo/grafoPrincipal.ts`
- Importe `StateGraph`, `END`, `START`, `Annotation` de `@langchain/langgraph`
- Defina o schema de estado com `Annotation.Root`
- Implemente `noAgente`, `noFerramentas` e `rotearAposAgente`
- Em `compilarGrafo`: monte e compile o `StateGraph`

### 6. `src/servidor/servidorMcp.ts`
- Importe `Server` e `StdioServerTransport` de `@modelcontextprotocol/sdk`
- Registre os handlers `ListTools` e `CallTool`
- Em `iniciarServidor`: conecte ao transporte Stdio

### 7. `src/index.ts`
- Descomente as importações e chamadas na função `main`

---

## Executar

```bash
# Desenvolvimento (com recarregamento automático)
npm run watch

# Produção
npm run build && npm start
```

---

## Configurar no Cursor

Adicione ao arquivo `.cursor/mcp.json` (ou nas configurações do Cursor):

```json
{
  "mcpServers": {
    "langgraph-mcp": {
      "command": "node",
      "args": ["caminho/para/langgraph-mcp/dist/index.js"],
      "env": {
        "OPENROUTER_API_KEY": "sua-chave-aqui"
      }
    }
  }
}
```

---

## Configurar no GitHub Copilot (VS Code)

Adicione ao `.vscode/mcp.json`:

```json
{
  "servers": {
    "langgraph-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["caminho/para/langgraph-mcp/dist/index.js"]
    }
  }
}
```

---

## Dependências Principais

| Pacote | Finalidade |
|---|---|
| `@langchain/langgraph` | Orquestração do grafo de agentes |
| `@langchain/core` | Abstrações base do LangChain |
| `@langchain/openai` | Cliente ChatOpenAI (compatível com OpenRouter) |
| `@modelcontextprotocol/sdk` | Servidor e cliente MCP |
| `dotenv` | Carregamento de variáveis de ambiente |
| `zod` | Validação de schemas |
