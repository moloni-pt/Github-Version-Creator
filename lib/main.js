"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const composer_1 = require("./composer");
const package_1 = require("./package");
const tag_1 = require("./tag");
try {
    let currentVersion = '';
    const usedMethod = core_1.getInput('method');
    const filePath = core_1.getInput('path');
    core_1.info(`Creating a new version using method: ${usedMethod}`);
    core_1.info(`Using the directory: ${filePath}`);
    switch (usedMethod) {
        case 'composer.json':
            currentVersion = composer_1.composerVersion(filePath);
            break;
        case 'package.json':
            currentVersion = package_1.packageVersion(filePath);
            break;
        default:
            currentVersion = tag_1.tagVersion();
            break;
    }
    if (currentVersion.length === 0) {
        core_1.setFailed("Failed obtaining the current version");
    }
    else {
        core_1.info(`Current Version: ${currentVersion}`);
        core_1.setOutput("version", currentVersion);
        if (github_1.context.payload && github_1.context.payload.head_commit && github_1.context.payload.head_commit.message) {
            core_1.setOutput("commit_title", github_1.context.payload.head_commit.message);
        }
    }
}
catch (error) {
    core_1.setFailed(error.message);
}
