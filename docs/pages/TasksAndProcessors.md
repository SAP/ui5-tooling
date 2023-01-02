# Tasks and Processors

## Example: Minifier

This sample demonstrates how standard processors and tasks can be written.

### Task

=== "ESM"

    ```js
    import minifier from "../processors/minifier.js"; // Require to processor

    export default async function({workspace, taskUtil, options: {pattern, omitSourceMapResources = false}}) {
        // "workspace" is a DuplexCollection that represents the projects source directory (e.g. /webapp)
        // When calling the standard APIs "byGlob" and "byPath" it will also return resources that have just been created by other tasks.
        // The minify task intents to only process those resources present in the project source directory therefore it calls the API "byGlobSource".

        // Collect all resources that shall be uglified. The caller provides the necessary GLOB pattern.
        const resources = await workspace.byGlob(pattern); 

        // Receive list of changed and newly created resources
        const processedResources = await minifier({  // Call to the processor
            resources, // Pass all resources
            options: {
                addSourceMappingUrl: !omitSourceMapResources
            }
        }); 

        // Write them back into the workspace DuplexCollection
        return Promise.all(processedResources.map(async ({resource, dbgResource, sourceMapResource}) => {
            if (taskUtil) {
                taskUtil.setTag(resource, taskUtil.STANDARD_TAGS.HasDebugVariant);
                taskUtil.setTag(dbgResource, taskUtil.STANDARD_TAGS.IsDebugVariant);
                taskUtil.setTag(sourceMapResource, taskUtil.STANDARD_TAGS.HasDebugVariant);
                if (omitSourceMapResources) {
                    taskUtil.setTag(sourceMapResource, taskUtil.STANDARD_TAGS.OmitFromBuildResult);
                }
            }
            return Promise.all([
                workspace.write(resource),
                workspace.write(dbgResource),
                workspace.write(sourceMapResource)
            ]);
        };
    };
    ```

=== "CommonJS"

    ```js
    module.exports = async function({workspace, taskUtil, options: {pattern, omitSourceMapResources = false}}) {
        const {default: minifier} = await import("../processors/minifier.js"); // Require to processor

        // "workspace" is a DuplexCollection that represents the projects source directory (e.g. /webapp)
        // When calling the standard APIs "byGlob" and "byPath" it will also return resources that have just been created by other tasks.
        // The minify task intents to only process those resources present in the project source directory therefore it calls the API "byGlobSource".

        // Collect all resources that shall be uglified. The caller provides the necessary GLOB pattern.
        const resources = await workspace.byGlob(pattern); 

        // Receive list of changed and newly created resources
        const processedResources = await minifier({  // Call to the processor
            resources, // Pass all resources
            options: {
                addSourceMappingUrl: !omitSourceMapResources
            }
        }); 

        // Write them back into the workspace DuplexCollection
        return Promise.all(processedResources.map(async ({resource, dbgResource, sourceMapResource}) => {
            if (taskUtil) {
                taskUtil.setTag(resource, taskUtil.STANDARD_TAGS.HasDebugVariant);
                taskUtil.setTag(dbgResource, taskUtil.STANDARD_TAGS.IsDebugVariant);
                taskUtil.setTag(sourceMapResource, taskUtil.STANDARD_TAGS.HasDebugVariant);
                if (omitSourceMapResources) {
                    taskUtil.setTag(sourceMapResource, taskUtil.STANDARD_TAGS.OmitFromBuildResult);
                }
            }
            return Promise.all([
                workspace.write(resource),
                workspace.write(dbgResource),
                workspace.write(sourceMapResource)
            ]);
        };
    };
    ```

### Processor

=== "ESM"

    ```js
    import posixPath from "node:path/posix";
    import {minify} from "terser";
    import Resource from "@ui5/fs/Resource";
    const copyrightCommentsAndBundleCommentPattern = /copyright|\(c\)(?:[0-9]+|\s+[0-9A-Za-z])|released under|license|\u00a9|^@ui5-bundle-raw-include |^@ui5-bundle /i;
    const debugFileRegex = /((?:\.view|\.fragment|\.controller|\.designtime|\.support)?\.js)$/;

    export default async function({resources, options: {addSourceMappingUrl = true} = {}}) {              
        // Receive list of resources to uglify
        return Promise.all(resources.map(async (resource) => {
            const dbgPath = resource.getPath().replace(debugFileRegex, "-dbg$1");
            const dbgResource = await resource.clone();
            dbgResource.setPath(dbgPath);

            const filename = posixPath.basename(resource.getPath());
            // Get resource content as string
            const code = await resource.getString();
            try {
                const sourceMapOptions = {
                    filename
                };
                if (addSourceMappingUrl) {
                    sourceMapOptions.url = filename + ".map";
                }
                const dbgFilename = posixPath.basename(dbgPath);
                // Call to the minify module
                const result = await minify({
                    // Use debug-name since this will be referenced in the source map "sources"
                    [dbgFilename]: code
                }, {
                    output: {
                        comments: copyrightCommentsAndBundleCommentPattern,
                        wrap_func_args: false
                    },
                    compress: false,
                    mangle: {
                        reserved: [
                            "jQuery",
                            "jquery",
                            "sap",
                        ]
                    },
                    sourceMap: sourceMapOptions
                });
                resource.setString(result.code);
                const sourceMapResource = new Resource({
                    path: resource.getPath() + ".map",
                    string: result.map
                });
                return {resource, dbgResource, sourceMapResource};
            } catch (err) {
                // Note: err.filename contains the debug-name
                throw new Error(
                    `Minification failed with error: ${err.message} in file ${filename} ` +
                    `(line ${err.line}, col ${err.col}, pos ${err.pos})`);
            }
        }));
    }
    ```

=== "CommonJS"

    ```js
    const posixPath = require("node:path/posix");
    const {minify} = require("terser");
    const copyrightCommentsAndBundleCommentPattern = /copyright|\(c\)(?:[0-9]+|\s+[0-9A-Za-z])|released under|license|\u00a9|^@ui5-bundle-raw-include |^@ui5-bundle /i;
    const debugFileRegex = /((?:\.view|\.fragment|\.controller|\.designtime|\.support)?\.js)$/;

    module.exports = async function({resources, options: {addSourceMappingUrl = true} = {}}) {   
        const {default: Resource} = await import("@ui5/fs/Resource");           
        // Receive list of resources to uglify
        return Promise.all(resources.map(async (resource) => {
            const dbgPath = resource.getPath().replace(debugFileRegex, "-dbg$1");
            const dbgResource = await resource.clone();
            dbgResource.setPath(dbgPath);

            const filename = posixPath.basename(resource.getPath());
            // Get resource content as string
            const code = await resource.getString();
            try {
                const sourceMapOptions = {
                    filename
                };
                if (addSourceMappingUrl) {
                    sourceMapOptions.url = filename + ".map";
                }
                const dbgFilename = posixPath.basename(dbgPath);
                // Call to the minify module
                const result = await minify({
                    // Use debug-name since this will be referenced in the source map "sources"
                    [dbgFilename]: code
                }, {
                    output: {
                        comments: copyrightCommentsAndBundleCommentPattern,
                        wrap_func_args: false
                    },
                    compress: false,
                    mangle: {
                        reserved: [
                            "jQuery",
                            "jquery",
                            "sap",
                        ]
                    },
                    sourceMap: sourceMapOptions
                });
                resource.setString(result.code);
                const sourceMapResource = new Resource({
                    path: resource.getPath() + ".map",
                    string: result.map
                });
                return {resource, dbgResource, sourceMapResource};
            } catch (err) {
                // Note: err.filename contains the debug-name
                throw new Error(
                    `Minification failed with error: ${err.message} in file ${filename} ` +
                    `(line ${err.line}, col ${err.col}, pos ${err.pos})`);
            }
        }));
    };
    ```
