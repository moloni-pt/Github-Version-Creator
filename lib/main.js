"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const composer_1 = require("./composer");
try {
    const usedMethod = core_1.getInput('method');
    const filePath = core_1.getInput('path');
    core_1.info(`Creating a new version using method: ${usedMethod}`);
    core_1.info(`Using the directory: ${filePath}`);
    const nextVersion = 'V1.0.1';
    if (usedMethod === 'composer.json') {
        core_1.setOutput("version", composer_1.composerVersion(filePath));
    }
    else {
    }
    if (github_1.context.payload && github_1.context.payload.head_commit && github_1.context.payload.head_commit.message) {
        core_1.setOutput("commit_title", github_1.context.payload.head_commit.message);
    }
    const payload = JSON.stringify(github_1.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
    core_1.setFailed('This is a test that should fail');
}
catch (error) {
    core_1.setFailed(error.message);
}