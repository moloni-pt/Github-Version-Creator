"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseDescription = exports.composerVersion = exports.findComposer = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const core_1 = require("@actions/core");
/**
 * Find package.json with path.
 * @param path
 */
exports.findComposer = (path) => {
    return fs_1.default.readFileSync(path_1.join(path, 'composer.json')).toString();
};
exports.composerVersion = (path) => {
    try {
        let composerFile = exports.findComposer(path);
        let composerData = JSON.parse(composerFile);
        if (composerData.version) {
            return composerData.version;
        }
        return '';
    }
    catch (error) {
        throw new Error(`Could not load the file from  ${path}composer.json`);
    }
};
exports.releaseDescription = (path) => {
    const releaseDescription = {
        'title': '',
        'description': '',
        'version': '',
        'tag': ''
    };
    try {
        const composerFile = exports.findComposer(path);
        const composerData = JSON.parse(composerFile);
        if (composerData.version) {
            releaseDescription.version = composerData.version;
        }
        if (composerData.extra && composerData.extra.changelog) {
            if (composerData.extra.changelog[0].version) {
                releaseDescription.version = composerData.extra.changelog[0].version;
            }
            if (composerData.extra.changelog[0].title) {
                releaseDescription.title = composerData.extra.changelog[0].title;
            }
            if (composerData.extra.changelog[0].description) {
                core_1.info(JSON.stringify(composerData.extra.changelog[0].description));
                composerData.extra.changelog[0].description.forEach((line) => {
                    core_1.info(line);
                    releaseDescription.description += `${line}\n`;
                });
            }
        }
    }
    catch (error) {
        throw new Error(`Could not load the file from  ${path}composer.json`);
    }
    return releaseDescription;
};
