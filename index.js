import { getInput, setOutput, setFailed } from '@actions/core';
import { context } from '@actions/github';

try {
  const usedMethod = getInput('method');
  console.log(`Creating a new version using method: ${method}`);

  const nextVersion = 'V1.0.1';

  setOutput("version", nextVersion);

  const payload = JSON.stringify(context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
  setFailed('This is a test that should fail');
} catch (error) {
  setFailed(error.message);
}
