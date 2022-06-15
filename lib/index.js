System.register("methods/composer", ["fs", "path", "@actions/core"], function (exports_1, context_1) {
    "use strict";
    var fs, path_1, core_1, findComposer, composerVersion, releaseDescription;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (fs_1) {
                fs = fs_1;
            },
            function (path_1_1) {
                path_1 = path_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }
        ],
        execute: function () {
            /**
             * Find package.json with path.
             * @param path
             */
            exports_1("findComposer", findComposer = function (path) {
                return fs.readFileSync(path_1.join(path, 'composer.json')).toString();
            });
            exports_1("composerVersion", composerVersion = function (path) {
                try {
                    var composerFile = findComposer(path);
                    var composerData = JSON.parse(composerFile);
                    if (composerData.version) {
                        return composerData.version;
                    }
                    return '';
                }
                catch (error) {
                    throw new Error("Could not load the file from  ".concat(path, "composer.json"));
                }
            });
            exports_1("releaseDescription", releaseDescription = function (path) {
                var releaseDescription = {
                    'title': '',
                    'description': '',
                    'version': ''
                };
                try {
                    var composerFile = findComposer(path);
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
                            core_1.info(JSON.stringify(composerData.extra.changelog[0].description));
                            composerData.extra.changelog[0].description.forEach(function (line) {
                                core_1.info(line);
                                releaseDescription.description += "".concat(line, "\n");
                            });
                        }
                    }
                }
                catch (error) {
                    throw new Error("Could not load the file from  ".concat(path, "composer.json"));
                }
                return releaseDescription;
            });
        }
    };
});
System.register("methods/package", ["fs", "path"], function (exports_2, context_2) {
    "use strict";
    var fs, path_2, findPackage, packageVersion;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (fs_2) {
                fs = fs_2;
            },
            function (path_2_1) {
                path_2 = path_2_1;
            }
        ],
        execute: function () {
            /**
             * Find package.json with path.
             * @param path
             */
            exports_2("findPackage", findPackage = function (path) {
                return fs.readFileSync(path_2.join(path, 'package.json')).toString();
            });
            exports_2("packageVersion", packageVersion = function (path) {
                try {
                    var packageFile = findPackage(path);
                    var packageData = JSON.parse(packageFile);
                    if (packageData.version) {
                        return packageData.version;
                    }
                    return '';
                }
                catch (error) {
                    throw new Error("Could not load the file from  ".concat(path, "package.json"));
                }
            });
        }
    };
});
System.register("main", ["@actions/core", "@actions/github", "methods/composer", "methods/package"], function (exports_3, context_3) {
    "use strict";
    var core_2, github_1, composer_1, package_1;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (github_1_1) {
                github_1 = github_1_1;
            },
            function (composer_1_1) {
                composer_1 = composer_1_1;
            },
            function (package_1_1) {
                package_1 = package_1_1;
            }
        ],
        execute: function () {
            try {
                var currentRelease = {
                    'title': '',
                    'description': '',
                    'version': ''
                };
                var usedMethod = core_2.getInput('method');
                var filePath = core_2.getInput('path');
                core_2.info("Creating a new version using method: ".concat(usedMethod));
                core_2.info("Using the directory: ".concat(filePath));
                switch (usedMethod) {
                    case 'composer.json':
                        currentRelease = composer_1.releaseDescription(filePath);
                        break;
                    case 'package.json':
                        currentRelease.version = package_1.packageVersion(filePath);
                        break;
                    default:
                        currentRelease = composer_1.releaseDescription(filePath);
                        break;
                }
                var ref = process.env.GITHUB_REF;
                core_2.info("Reference push: ".concat(ref));
                if (ref && ref.startsWith("refs/tags/")) {
                    var tag = ref.replace(/^refs\/tags\//, "");
                    core_2.info("Release Tag: ".concat(tag));
                    core_2.setOutput("tag", tag);
                }
                else {
                    core_2.setOutput("tag", "");
                }
                core_2.info("Release Version: ".concat(currentRelease.version));
                core_2.setOutput("version", currentRelease.version);
                if (currentRelease.title.length === 0) {
                    if (github_1.context.payload && github_1.context.payload.head_commit && github_1.context.payload.head_commit.message) {
                        core_2.setOutput("title", github_1.context.payload.head_commit.message);
                    }
                }
                else {
                    core_2.info("Release Title: ".concat(currentRelease.title));
                    core_2.setOutput("title", currentRelease.title);
                }
                if (currentRelease.title.length > 0) {
                    core_2.info("Release Description: ".concat(currentRelease.description));
                    core_2.setOutput("description", currentRelease.description);
                }
            }
            catch (error) {
                core_2.setFailed(error.message);
            }
        }
    };
});
