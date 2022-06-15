import { getInput, setOutput, setFailed, info } from "@actions/core";
import { context } from "@actions/github";

import { releaseDescription } from "./methods/composer";
import { packageVersion } from "./methods/package";
import getReleaseTag from "./methods/getReleaseTag";

try {
  let releaseTag = getReleaseTag();
  let currentRelease = {
    "title": "",
    "description": "",
    "version": ""
  };

  const usedMethod = getInput("method");
  const filePath = getInput("path");

  info(`Creating a new version using method: ${usedMethod}`);
  info(`Using the directory: ${filePath}`);

  switch (usedMethod) {
    case "composer.json":
      currentRelease = releaseDescription(filePath);
      break;
    case "package.json":
      currentRelease.version = packageVersion(filePath);
      break;
    default:
      currentRelease = releaseDescription(filePath);
      break;
  }

  info(`Release Version: ${currentRelease.version}`);
  setOutput("version", currentRelease.version);

  if (currentRelease.title.length) {
    info(`Release Title: ${currentRelease.title}`);
    setOutput("title", currentRelease.title);
  } else if (releaseTag.length) {
    setOutput("title", `Release ${releaseTag}`);
  } else if (context.payload && context.payload.head_commit && context.payload.head_commit.message) {
    setOutput("title", context.payload.head_commit.message);
  }

  if (currentRelease.description.length) {
    info(`Release Description: ${currentRelease.description}`);
    setOutput("description", currentRelease.description);
  }

  setOutput("tag", releaseTag);
} catch (error: any) {
  setFailed(error.message);
}
