"use strict";
exports.__esModule = true;
exports.releaseDescription = exports.composerVersion = exports.findComposer = void 0;
var fs = require("fs");
var path_1 = require("path");
var core_1 = require("@actions/core");
/**
 * Find package.json with path.
 * @param path
 */
var findComposer = function (path) {
    return fs.readFileSync((0, path_1.join)(path, 'composer.json')).toString();
};
exports.findComposer = findComposer;
var composerVersion = function (path) {
    try {
        var composerFile = (0, exports.findComposer)(path);
        var composerData = JSON.parse(composerFile);
        if (composerData.version) {
            return composerData.version;
        }
        return '';
    }
    catch (error) {
        throw new Error("Could not load the file from  ".concat(path, "composer.json"));
    }
};
exports.composerVersion = composerVersion;
var releaseDescription = function (path) {
    var releaseDescription = {
        'title': '',
        'description': '',
        'version': ''
    };
    try {
        var composerFile = (0, exports.findComposer)(path);
        var composerData = JSON.parse(composerFile);
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
                composerData.extra.changelog[0].description.forEach(function (line) {
                    (0, core_1.info)(line);
                    releaseDescription.description += "".concat(line, "\n");
                });
            }
        }
    }
    catch (error) {
        throw new Error("Could not load the file from  ".concat(path, "composer.json"));
    }
    return releaseDescription;
};
exports.releaseDescription = releaseDescription;
