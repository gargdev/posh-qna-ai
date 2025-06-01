import 'dotenv/config';
import { answerQuery } from './services/chat.service';

async function test() {
  const response = await answerQuery("What is POSH Act?");
  console.log("Answer:", response);
}

test().catch(console.error);
