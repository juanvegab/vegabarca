import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.NEXT_PUBLIC_PINECONE_API_KEY;

if (!apiKey) throw new Error("No Pinecone key found");

const pinecone = new Pinecone({
  apiKey,
});

export const notesIndex = pinecone.Index("vegabarca");
export const experiencesIndex = pinecone.Index("vegabarca");
