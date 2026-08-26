import * as core from "@actions/core";

export type Inputs = {
  token: string;
};

export function getInputs(): Inputs {
  return {
    token: core.getInput("github-token", { required: true }),
  };
}
