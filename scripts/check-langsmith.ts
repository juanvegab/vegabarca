import { Client } from "langsmith";

const DATASET_ID = "c6aedb00-d755-46fa-9eb1-e2b6f2c1fc51";

async function main() {
  const client = new Client();
  console.log("LANGCHAIN_API_KEY:", process.env.LANGCHAIN_API_KEY?.slice(0, 20) + "...\n");

  console.log("Examples en vegabarca-traces:");
  let count = 0;
  for await (const example of client.listExamples({ datasetId: DATASET_ID })) {
    count++;
    console.log(` [${count}] inputs:`, JSON.stringify(example.inputs).slice(0, 80));
  }
  console.log(`\nTotal: ${count} ejemplos`);
}

main().catch(console.error);
