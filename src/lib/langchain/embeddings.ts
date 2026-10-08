import { Embeddings, EmbeddingsParams } from "@langchain/core/embeddings";
import { getEmbedding } from "@/lib/embeddings";

export class VoyageEmbeddings extends Embeddings {
  constructor(params?: EmbeddingsParams) {
    super(params ?? {});
  }

  // Called when indexing documents — uses input_type: "document" for better retrieval quality
  async embedDocuments(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((text) => getEmbedding(text, "document")));
  }

  // Called when embedding a search query — uses input_type: "query"
  async embedQuery(text: string): Promise<number[]> {
    return getEmbedding(text, "query");
  }
}
