import * as core from "@actions/core";

import { Context } from "./context.js";
import { Inputs } from "./inputs.js";
import { GitHubClient } from "./github-client.js";

export async function run(
  context: Context,
  inputs: Inputs,
  client: GitHubClient,
): Promise<void> {
  //
  // TODO: your logic here
  //

  const pr = await client.getPullRequest(
    context.owner,
    context.repo,
    context.pullRequestNumber,
  );

  core.info(JSON.stringify(context));
  core.info(JSON.stringify(inputs));
  core.info(JSON.stringify(pr));
}
