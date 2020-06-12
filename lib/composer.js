"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.composerVersion = exports.findComposer = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
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
