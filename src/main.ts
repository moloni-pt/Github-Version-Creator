import { getInput, setOutput, setFailed } from '@actions/core';
import { context } from '@actions/github';

import { composerVersion } from './composer';

try {
  const usedMethod = getInput('method');
  const filePath = getInput('path');

  console.log(`Creating a new version using method: ${usedMethod}`);
  console.log(`Using the directory: ${filePath}`);

  const nextVersion = 'V1.0.1';

  composerVersion(filePath);

  setOutput("version", nextVersion);

  if (context.payload && context.payload.head_commit && context.payload.head_commit.message) {
    setOutput("commit_title", context.payload.head_commit.message);
  }

  const payload = JSON.stringify(context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
  setFailed('This is a test that should fail');
} catch (error) {
  setFailed(error.message);
}
