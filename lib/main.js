"use strict";
exports.__esModule = true;
var core_1 = require("@actions/core");
var github_1 = require("@actions/github");
var composer_1 = require("./methods/composer");
var package_1 = require("./methods/package");
try {
    var currentRelease = {
        'title': '',
        'description': '',
        'version': ''
    };
    var usedMethod = (0, core_1.getInput)('method');
    var filePath = (0, core_1.getInput)('path');
    (0, core_1.info)("Creating a new version using method: ".concat(usedMethod));
    (0, core_1.info)("Using the directory: ".concat(filePath));
    switch (usedMethod) {
        case 'composer.json':
            currentRelease = (0, composer_1.releaseDescription)(filePath);
            break;
        case 'package.json':
            currentRelease.version = (0, package_1.packageVersion)(filePath);
            break;
        default:
            currentRelease = (0, composer_1.releaseDescription)(filePath);
            break;
    }
    var ref = process.env.GITHUB_REF;
    (0, core_1.info)("Reference push: ".concat(ref));
    if (ref && ref.startsWith("refs/tags/")) {
        var tag = ref.replace(/^refs\/tags\//, "");
        (0, core_1.info)("Release Tag: ".concat(tag));
        (0, core_1.setOutput)("tag", tag);
    }
    else {
        (0, core_1.setOutput)("tag", "");
    }
    (0, core_1.info)("Release Version: ".concat(currentRelease.version));
    (0, core_1.setOutput)("version", currentRelease.version);
    if (currentRelease.title.length === 0) {
        if (github_1.context.payload && github_1.context.payload.head_commit && github_1.context.payload.head_commit.message) {
            (0, core_1.setOutput)("title", github_1.context.payload.head_commit.message);
        }
    }
    else {
        (0, core_1.info)("Release Title: ".concat(currentRelease.title));
        (0, core_1.setOutput)("title", currentRelease.title);
    }
    if (currentRelease.title.length > 0) {
        (0, core_1.info)("Release Description: ".concat(currentRelease.description));
        (0, core_1.setOutput)("description", currentRelease.description);
    }
}
catch (error) {
    (0, core_1.setFailed)(error.message);
}
