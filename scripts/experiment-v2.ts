/**
 * LangSmith Experiment: v2-concise-prompt
 * Manual evaluation loop — bypasses evaluate() SDK bug in 0.10.x
 *
 * Run: npx tsx --env-file=.env.local scripts/experiment-v2.ts
 */

import { Client } from "langsmith";
import { ragChain } from "../src/lib/langchain/chain";
import Anthropic from "@anthropic-ai/sdk";

const client = new Client();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const DATASET_ID = "4251ddd6-9fde-4e51-ba46-244ffb4b2ad5";

// ─── Evaluator 1: primera persona (LLM-as-Judge) ─────────────────────────────
async function scoreFirstPerson(output: string): Promise<number> {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 100,
    messages: [{
      role: "user",
      content: `Does this response use first-person language (I, my, me, I've, I'm)?
Response: "${output}"
Return ONLY JSON: {"score": 1.0} or {"score": 0.0}`,
    }],
  });
  const text = response.content[0].type === "text" ? response.content[0].text : "{}";
  const parsed = JSON.parse(text.match(/\{[^}]+\}/)?.[0] ?? '{"score":0}');
  return Number(parsed.score ?? 0);
}

// ─── Evaluator 2: concisión (heurística) ─────────────────────────────────────
function scoreConcision(output: string): number {
  const sentences = output.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  let score = 1.0;
  if (sentences.length === 3) score = 0.5;
  if (sentences.length >= 4) score = 0.0;
  const fillers = ["Great question", "Sure!", "Absolutely!", "Of course!"];
  if (fillers.some((f) => output.startsWith(f))) score = Math.max(0, score - 0.5);
  return score;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🧪 Experiment: v2-concise-prompt");
  console.log("   Dataset:", DATASET_ID);
  console.log("   Evaluators: first-person (LLM), concision (heuristic)\n");

  // 1. Load examples from dataset
  const examples: Array<{ id: string; inputs: Record<string, unknown> }> = [];
  for await (const ex of client.listExamples({ datasetId: DATASET_ID })) {
    examples.push({ id: ex.id, inputs: ex.inputs });
  }
  console.log(`Found ${examples.length} examples in dataset\n`);

  if (examples.length === 0) {
    console.log("❌ Dataset is empty. Run seed-dataset.ts first.");
    return;
  }

  const results: Array<{ question: string; output: string; firstPerson: number; concision: number }> = [];

  // 2. Run each example through the chain and evaluate
  for (const [i, example] of examples.entries()) {
    const question = String(example.inputs.question ?? example.inputs.input ?? "");
    console.log(`[${i + 1}/${examples.length}] Q: ${question.slice(0, 60)}...`);

    const output = await ragChain.invoke({ question, chat_history: [] });
    const firstPerson = await scoreFirstPerson(output);
    const concision = scoreConcision(output);

    console.log(`   Output: ${output.slice(0, 80)}...`);
    console.log(`   first-person: ${firstPerson} | concision: ${concision}\n`);

    results.push({ question, output, firstPerson, concision });
  }

  // 3. Summary
  const avgFirstPerson = results.reduce((s, r) => s + r.firstPerson, 0) / results.length;
  const avgConcision = results.reduce((s, r) => s + r.concision, 0) / results.length;

  console.log("━".repeat(60));
  console.log("✅ Experiment complete — v2-concise-prompt results:");
  console.log(`   Avg first-person score : ${avgFirstPerson.toFixed(2)}`);
  console.log(`   Avg concision score    : ${avgConcision.toFixed(2)}`);
  console.log("\nBaseline (v1) to compare against next run with original prompt.");
}

main().catch((err) => {
  console.error("Experiment failed:", err);
  process.exit(1);
});
