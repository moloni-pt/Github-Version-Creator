define("methods/composer", ["require", "exports", "fs", "path", "@actions/core"], function (require, exports, fs, path_1, core_1) {
    "use strict";
    exports.__esModule = true;
    exports.releaseDescription = exports.composerVersion = exports.findComposer = void 0;
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
});
define("methods/package", ["require", "exports", "fs", "path"], function (require, exports, fs, path_2) {
    "use strict";
    exports.__esModule = true;
    exports.packageVersion = exports.findPackage = void 0;
    /**
     * Find package.json with path.
     * @param path
     */
    var findPackage = function (path) {
        return fs.readFileSync((0, path_2.join)(path, 'package.json')).toString();
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
});
define("main", ["require", "exports", "@actions/core", "@actions/github", "methods/composer", "methods/package"], function (require, exports, core_2, github_1, composer_1, package_1) {
    "use strict";
    exports.__esModule = true;
    try {
        var currentRelease = {
            'title': '',
            'description': '',
            'version': ''
        };
        var usedMethod = (0, core_2.getInput)('method');
        var filePath = (0, core_2.getInput)('path');
        (0, core_2.info)("Creating a new version using method: ".concat(usedMethod));
        (0, core_2.info)("Using the directory: ".concat(filePath));
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
        (0, core_2.info)("Reference push: ".concat(ref));
        if (ref && ref.startsWith("refs/tags/")) {
            var tag = ref.replace(/^refs\/tags\//, "");
            (0, core_2.info)("Release Tag: ".concat(tag));
            (0, core_2.setOutput)("tag", tag);
        }
        else {
            (0, core_2.setOutput)("tag", "");
        }
        (0, core_2.info)("Release Version: ".concat(currentRelease.version));
        (0, core_2.setOutput)("version", currentRelease.version);
        if (currentRelease.title.length === 0) {
            if (github_1.context.payload && github_1.context.payload.head_commit && github_1.context.payload.head_commit.message) {
                (0, core_2.setOutput)("title", github_1.context.payload.head_commit.message);
            }
        }
        else {
            (0, core_2.info)("Release Title: ".concat(currentRelease.title));
            (0, core_2.setOutput)("title", currentRelease.title);
        }
        if (currentRelease.title.length > 0) {
            (0, core_2.info)("Release Description: ".concat(currentRelease.description));
            (0, core_2.setOutput)("description", currentRelease.description);
        }
    }
    catch (error) {
        (0, core_2.setFailed)(error.message);
    }
});
