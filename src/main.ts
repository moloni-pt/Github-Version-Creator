import { getInput, setOutput, setFailed, info } from '@actions/core';
import { context } from '@actions/github';

import { composerVersion } from './composer';

try {
  const usedMethod = getInput('method');
  const filePath = getInput('path');

  info(`Creating a new version using method: ${usedMethod}`);
  info(`Using the directory: ${filePath}`);

  const nextVersion = 'V1.0.1';

  if (usedMethod === 'composer.json') {
    setOutput("version", composerVersion(filePath));
  } else {

  }


  if (context.payload && context.payload.head_commit && context.payload.head_commit.message) {
    setOutput("commit_title", context.payload.head_commit.message);
  }

  const payload = JSON.stringify(context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
  setFailed('This is a test that should fail');
} catch (error) {
  setFailed(error.message);
}
