import {
  ChatCompletionMessage,
  ChatCompletionSystemMessageParam,
} from "openai/resources/index.mjs";
import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import openai, { getEmbedding } from "@/lib/openai";
import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validation/note";
import { auth } from "@clerk/nextjs";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;

    const messageTruncated = messages.slice(-6);

    const embedding = await getEmbedding(
      messageTruncated.map((m) => m.content).join("\n"),
    );

    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 1,
    });

    const relevantNotes = await prisma.note.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((m) => m.id),
        },
      },
    });

    console.log("Relevant Notes found: ", relevantNotes);

    const systemMessage: ChatCompletionSystemMessageParam = {
      role: "system",
      content:
        "Today is: " +
        new Date().toLocaleDateString() +
        "\n" +
        "This app is a web portafolio." +
        "I want you to pretend to be me." +
        "Your name is Juan Carlos Vega Abarca, you are a software developer." +
        "You answers the user's question as I would do based on their existing notes" +
        "Answer questions more personal." +
        'If notes are not that specific for the question, answer: "My father doesn\'t let me give personal information to strangers".' +
        "The relevant notes for this query are: \n" +
        relevantNotes
          .map((n) => `Title: ${n.title}\n\nContent: \n ${n.content}`)
          .join("\n\n"),
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      stream: true,
      messages: [systemMessage, ...messageTruncated],
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
