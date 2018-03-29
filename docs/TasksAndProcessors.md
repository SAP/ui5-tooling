# Tasks and Processors

## Example: Uglifier
#### Task
```js
const uglifyProcessor = require("../processors/uglifier"); // Require to processor

module.exports = function({workspace, options}) {       // "workspace" is a DuplexCollection that represents the projects source directory (e.g. /webapp)
                                                        // When calling the standard APIs "byGlob" and "byPath" it will also return resources that have
                                                        //  just been created by other tasks.
                                                        // The uglify task intents to only process those resources present in the project source directory
                                                        //  therefore it calls the API "byGlobSource".
    return workspace.byGlobSource(options.pattern)      // Collect all resources that shall be uglified. The caller provides the necessary GLOB pattern.
        .then((allResources) => {
            return uglifyProcessor({                    // Call to the processor
                resources: allResources                 // Pass all resources
            });
        })
        .then((processedResources) => {                 // Receive list of changed and newly created resources
            return Promise.all(
                processedResources.map((resource) => {
                    return workspace.write(resource);   // Write them back into the workspace DuplexCollection
                })
            );
        });
};
```

#### Processor
```js
const uglify = require("uglify-es");
const copyrightCommentsPattern = /copyright|\(c\)(?:[0-9]+|\s+[0-9A-za-z])|released under|license|\u00a9/i;

module.exports = function({resources}) {                // Receive list of resources to uglify
    return Promise.all(resources.map((resource) => {
        return resource.getString().then((code) => {    // Get resource content as string
            const result = uglify.minify({              // Call to the uglify module
                [resource.getPath()]: code
            }, {
                warnings: false,
                output: {
                    comments: copyrightCommentsPattern
                }
            });
            if (result.error) {
                throw new Error(                        // Just throw errors if something fails
                    `Uglification failed with error: ${result.error.message} in file ${result.error.filename} ` +
                    `(line ${result.error.line}, col ${result.error.col}, pos ${result.error.pos})`);
            }

            resource.setString(result.code);            // Update content of the resource
            return resource;                            // Resolve with list of resources
        });
    }));
};

```