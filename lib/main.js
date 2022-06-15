"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const composer_1 = require("./methods/composer");
const package_1 = require("./methods/package");
try {
    let tag = "";
    let currentRelease = {
        "title": "",
        "description": "",
        "version": "",
        tag
    };
    const usedMethod = core_1.getInput("method");
    const filePath = core_1.getInput("path");
    core_1.info(`Creating a new version using method: ${usedMethod}`);
    core_1.info(`Using the directory: ${filePath}`);
    switch (usedMethod) {
        case "composer.json":
            currentRelease = composer_1.releaseDescription(filePath);
            break;
        case "package.json":
            currentRelease.version = package_1.packageVersion(filePath);
            break;
        default:
            currentRelease = composer_1.releaseDescription(filePath);
            break;
    }
    const ref = process.env.GITHUB_REF;
    if (ref && !(ref === null || ref === void 0 ? void 0 : ref.startsWith("refs/tags/"))) {
        currentRelease.tag = ref.replace(/^refs\/tags\//, "");
    }
    else {
        currentRelease.tag = "";
    }
    if (currentRelease.version.length === 0) {
        throw new Error(`Failed obtaining the current version`);
    }
    core_1.info(`Release Version: ${currentRelease.version}`);
    core_1.setOutput("version", currentRelease.version);
    if (currentRelease.title.length === 0) {
        if (github_1.context.payload && github_1.context.payload.head_commit && github_1.context.payload.head_commit.message) {
            core_1.setOutput("title", github_1.context.payload.head_commit.message);
        }
    }
    else {
        core_1.info(`Release Title: ${currentRelease.title}`);
        core_1.setOutput("title", currentRelease.title);
    }
    if (currentRelease.title.length > 0) {
        core_1.info(`Release Description: ${currentRelease.description}`);
        core_1.setOutput("description", currentRelease.description);
    }
    core_1.setOutput("tag", currentRelease.tag);
}
catch (error) {
    core_1.setFailed(error.message);
}
