// import pdfParse from 'pdf-parse';
// import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
// import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
// import { FaissStore } from '@langchain/community/vectorstores/faiss';

// import { MemoryVectorStore } from 'langchain/vectorstores/memory'; // For dev testing

// export const processPdfBuffer = async (buffer: Buffer) => {
//   const data = await pdfParse(buffer);

//   const splitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 500,
//     chunkOverlap: 50,
//   });

//   const chunks = await splitter.createDocuments([data.text]);

//   const embeddings = new OpenAIEmbeddings(); // uses OPENAI_API_KEY from env

//   // FAISS store (in-memory for now)
//   const vectorStore = await FaissStore.fromDocuments(chunks, embeddings);

//   // Save FAISS index to disk if needed
//   await vectorStore.save('./vector-db/faiss-index');

//   return { chunks: chunks.length };
// };
// test
import pdfParse from 'pdf-parse';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { FaissStore } from '@langchain/community/vectorstores/faiss';

import { MemoryVectorStore } from 'langchain/vectorstores/memory'; // For dev testing

export const processPdfBuffer = async (buffer: Buffer) => {
  const data = await pdfParse(buffer);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const chunks = await splitter.createDocuments([data.text]);

  const embeddings = new OpenAIEmbeddings(); // uses OPENAI_API_KEY from env

  const vectorStore = await FaissStore.fromDocuments(chunks, embeddings);

  await vectorStore.save('./vector-db/faiss-index');

  return { chunks: chunks.length };
};
