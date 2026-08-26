import * as github from "@actions/github";

export type PullRequest = {
  number: number;
  title: string;
};

export interface GitHubClient {
  getPullRequest: (
    owner: string,
    repo: string,
    pull_number: number,
  ) => Promise<PullRequest>;
}

export function realGitHubClient(token: string): GitHubClient {
  const client = github.getOctokit(token);

  return {
    getPullRequest: async (
      owner: string,
      repo: string,
      pull_number: number,
    ): Promise<PullRequest> => {
      const response = await client.rest.pulls.get({
        owner,
        repo,
        pull_number,
      });
      return response.data;
    },
  };
}
