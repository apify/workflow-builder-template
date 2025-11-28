/**
 * Code generation template for Run Apify Actor action
 * This template is used when exporting workflows to standalone Next.js projects
 * It uses environment variables instead of integrationId
 */
export const runActorCodegenTemplate = `import { ApifyClient } from "apify-client";

export async function apifyRunActorStep(input: {
  actorId: string;
  actorInput?: Record<string, unknown>;
}) {
  "use step";

  const apiKey = process.env.APIFY_API_KEY!;
  const client = new ApifyClient({ token: apiKey });
  const actorClient = client.actor(input.actorId);
  const maxWaitSecs = 120;

    // Run synchronously and wait for completion
    const runData = await actorClient.call(input.actorInput || {}, {
      waitSecs: maxWaitSecs,
    });

    // Get dataset items
    let data: unknown[] = [];
    if (runData.defaultDatasetId) {
      const datasetItems = await client
        .dataset(runData.defaultDatasetId)
        .listItems();
      data = datasetItems.items;
    }

    return {
      runId: runData.id || "unknown",
      status: runData.status || "SUCCEEDED",
      datasetId: runData.defaultDatasetId,
      data,
    };
}`;
