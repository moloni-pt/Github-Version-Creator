"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageVersion = exports.findPackage = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
/**
 * Find package.json with path.
 * @param path
 */
exports.findPackage = (path) => {
    return fs_1.default.readFileSync(path_1.join(path, 'package.json')).toString();
};
exports.packageVersion = (path) => {
    try {
        let packageFile = exports.findPackage(path);
        let packageData = JSON.parse(packageFile);
        if (packageData.version) {
            return packageData.version;
        }
        return '';
    }
    catch (error) {
        throw new Error(`Could not load the file from  ${path}package.json`);
    }
};
