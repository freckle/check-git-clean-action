import * as github from "@actions/github";

export type Context = {
  eventName: string;
  owner: string;
  repo: string;
  pullRequestNumber: number;
};

export function getContext(): Context {
  return {
    eventName: github.context.eventName,
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pullRequestNumber: github.context.payload.number,
  };
}
