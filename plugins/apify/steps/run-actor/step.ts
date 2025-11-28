import "server-only";

import { ApifyClient } from "apify-client";
import { fetchCredentials } from "@/lib/credential-fetcher";
import { getErrorMessage } from "@/lib/utils";

type ApifyRunActorResult =
  | {
      success: true;
      runId: string;
      status: string;
      datasetId?: string;
      data?: unknown[];
    }
  | { success: false; error: string };

/**
 * Run Apify Actor Step
 * Runs an Apify Actor and optionally waits for results
 */
export async function apifyRunActorStep(input: {
  integrationId?: string;
  actorId: string;
  actorInput?: Record<string, unknown>;
}): Promise<ApifyRunActorResult> {
  "use step";

  const credentials = input.integrationId
    ? await fetchCredentials(input.integrationId)
    : {};

  const apiKey = credentials.APIFY_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: "Apify API Token is not configured.",
    };
  }

  try {
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
          success: true,
          runId: runData.id || "unknown",
          status: runData.status || "SUCCEEDED",
          datasetId: runData.defaultDatasetId,
          data,
      };
  } catch (error) {
    return {
      success: false,
      error: `Failed to run Actor: ${getErrorMessage(error)}`,
    };
  }
}
