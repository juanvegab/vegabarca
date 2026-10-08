import { VoyageAIClient } from "voyageai";

const apiKey = process.env.VOYAGE_API_KEY;

if (!apiKey) throw new Error("No Voyage API key found");

const voyage = new VoyageAIClient({ apiKey });

export const getEmbedding = async (
  input: string,
  inputType: "query" | "document" = "query",
): Promise<number[]> => {
  const response = await voyage.embed({
    input: [input],
    model: "voyage-3",
    inputType,
  });

  const embedding = response.data?.[0]?.embedding;

  if (!embedding) throw new Error("No embedding found");

  return embedding as number[];
};
