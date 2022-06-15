import { getInput, setOutput, setFailed, info } from '@actions/core';
import { context } from '@actions/github';

import { releaseDescription } from './methods/composer';
import { packageVersion } from './methods/package';

try {
  let currentRelease = {
    'title': '',
    'description': '',
    'version': ''
  };

  const usedMethod = getInput('method');
  const filePath = getInput('path');

  info(`Creating a new version using method: ${usedMethod}`);
  info(`Using the directory: ${filePath}`);

  switch (usedMethod) {
    case 'composer.json': currentRelease = releaseDescription(filePath); break;
    case 'package.json': currentRelease.version = packageVersion(filePath); break;
    default: currentRelease = releaseDescription(filePath); break;
  }

  const ref = process.env.GITHUB_REF;

  if (ref && ref.startsWith("refs/tags/")) {
    const tag = ref.replace(/^refs\/tags\//, "");
    info(`Release Tag: ${tag}`);
    setOutput("tag", tag);

  } else {
    setOutput("tag", "");
  }

  info(`Release Version: ${currentRelease.version}`);
  setOutput("version", currentRelease.version);

  if (currentRelease.title.length === 0) {
    if (context.payload && context.payload.head_commit && context.payload.head_commit.message) {
      setOutput("title", context.payload.head_commit.message);
    }
  } else {
    info(`Release Title: ${currentRelease.title}`);
    setOutput("title", currentRelease.title);
  }

  if (currentRelease.title.length > 0) {
    info(`Release Description: ${currentRelease.description}`);
    setOutput("description", currentRelease.description);
  }
} catch (error) {
  setFailed(error.message);
}
