import * as core from "@actions/core";

import { getContext } from "./context.js";
import { getInputs } from "./inputs.js";
import { realGitHubClient } from "./github-client.js";
import { run } from "./run.js";

async function main() {
  try {
    const context = getContext();
    const inputs = getInputs();
    const client = realGitHubClient(inputs.token);
    await run(context, inputs, client);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else if (typeof error === "string") {
      core.setFailed(error);
    } else {
      core.setFailed("Non-Error exception");
    }
  }
}

main();
