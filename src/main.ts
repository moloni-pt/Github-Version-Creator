import { getInput, setOutput, setFailed, info } from '@actions/core';
import { context } from '@actions/github';

import { composerVersion } from './composer';
import { tagVersion } from './tag';

try {
  let currentVersion = '';

  const usedMethod = getInput('method');
  const filePath = getInput('path');

  info(`Creating a new version using method: ${usedMethod}`);
  info(`Using the directory: ${filePath}`);



  if (usedMethod === 'composer.json') {
    currentVersion = composerVersion(filePath);
  } else {
    currentVersion = tagVersion();
  }

  if (currentVersion.length === 0) {
    setFailed("Failed obtaining the current version");
  } else {
    info(`Next Version: ${currentVersion}`);
    setOutput("version", currentVersion);

    if (context.payload && context.payload.head_commit && context.payload.head_commit.message) {
      setOutput("commit_title", context.payload.head_commit.message);
    }
  }

  setFailed('This is a test that should fail');
} catch (error) {
  setFailed(error.message);
}
