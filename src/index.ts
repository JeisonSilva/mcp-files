import 'dotenv/config';
import { iniciarServidor } from './servidor';

async function main(): Promise<void> {
  await iniciarServidor();
}

main().catch((erro) => {
  process.stderr.write(`[langgraph-mcp] Erro fatal: ${erro}\n`);
  process.exit(1);
});
