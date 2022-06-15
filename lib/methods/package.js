"use strict";
exports.__esModule = true;
exports.packageVersion = exports.findPackage = void 0;
var fs = require("fs");
var path_1 = require("path");
/**
 * Find package.json with path.
 * @param path
 */
var findPackage = function (path) {
    return fs.readFileSync((0, path_1.join)(path, 'package.json')).toString();
};
exports.findPackage = findPackage;
var packageVersion = function (path) {
    try {
        var packageFile = (0, exports.findPackage)(path);
        var packageData = JSON.parse(packageFile);
        if (packageData.version) {
            return packageData.version;
        }
        return '';
    }
    catch (error) {
        throw new Error("Could not load the file from  ".concat(path, "package.json"));
    }
};
exports.packageVersion = packageVersion;
