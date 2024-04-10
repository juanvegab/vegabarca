import OpenAI from "openai";

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

if (!apiKey) throw new Error("No OpenAI API key found");

const openai = new OpenAI({ apiKey });

export default openai;

export const getEmbedding = async (input: string) => {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input,
  });

  const embedding = response.data[0].embedding;

  if (!embedding) throw new Error("No embedding found");

  console.log("Embedding:", embedding);

  return embedding;
};
