"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseDescription = exports.composerVersion = exports.findComposer = void 0;
const fs = __importStar(require("fs"));
const path_1 = require("path");
const core_1 = require("@actions/core");
/**
 * Find package.json with path.
 * @param path
 */
const findComposer = (path) => {
    return fs.readFileSync((0, path_1.join)(path, 'composer.json')).toString();
};
exports.findComposer = findComposer;
const composerVersion = (path) => {
    try {
        let composerFile = (0, exports.findComposer)(path);
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
exports.composerVersion = composerVersion;
const releaseDescription = (path) => {
    const releaseDescription = {
        'title': '',
        'description': '',
        'version': ''
    };
    try {
        const composerFile = (0, exports.findComposer)(path);
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
                (0, core_1.info)(JSON.stringify(composerData.extra.changelog[0].description));
                composerData.extra.changelog[0].description.forEach((line) => {
                    (0, core_1.info)(line);
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
exports.releaseDescription = releaseDescription;
