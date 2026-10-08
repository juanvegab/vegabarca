/**
 * Seed the vegabarca-traces dataset with test questions.
 * Run: npx tsx --env-file=.env.local scripts/seed-dataset.ts
 */

import { Client } from "langsmith";

const DATASET_NAME = "vegabarca-experiment";

const questions = [
  { question: "What are you working on right now?" },
  { question: "What is your most recent experience?" },
  { question: "Do you have React Native experience?" },
  { question: "What are your strongest technical skills?" },
  { question: "Have you worked with AI or machine learning?" },
  { question: "What backend technologies do you use?" },
];

async function main() {
  const client = new Client();

  // Create a fresh dataset (or reuse if already exists)
  let dataset;
  try {
    dataset = await client.readDataset({ datasetName: DATASET_NAME });
    console.log(`Dataset "${DATASET_NAME}" already exists — id: ${dataset.id}`);
  } catch {
    dataset = await client.createDataset(DATASET_NAME, {
      description: "Test questions for prompt engineering experiments",
    });
    console.log(`Created dataset "${DATASET_NAME}" — id: ${dataset.id}`);
  }

  await client.createExamples({
    datasetId: dataset.id,
    inputs: questions,
  });

  console.log(`\n✅ Seeded ${questions.length} examples.`);
  console.log(`Dataset ID: ${dataset.id}`);
  console.log("\nUpdate DATASET_ID in experiment-v2.ts with this ID, then run:");
  console.log("  npx tsx --env-file=.env.local scripts/experiment-v2.ts");
}

main().catch(console.error);
