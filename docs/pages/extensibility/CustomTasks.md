# Custom UI5 Builder Tasks

The UI5 Build Extensibility enables you to enhance the build process of any UI5 project. In addition to the [standard tasks](../Builder.md#standard-tasks), custom tasks can be created.

The UI5 community already created many custom tasks which you can integrate into your project. They are often prefixed by `ui5-task-` to make them easily searchable in the [npm registry](https://www.npmjs.com/search?q=ui5-task-).

Please note that custom tasks from third parties can not only modify your project but also execute arbitrary code on your system. In fact, this is the case for all npm packages you install. Always act with the according care and follow best practices.

## Configuration

You can configure your build process with additional build task. These custom tasks are defined in the project [configuration](../Configuration.md).

To hook your custom tasks into the different build phases of a project, they need to reference other tasks to be executed before or after. This can be a [standard task](../Builder.md#standard-tasks) or another custom task. Note that a custom task will only be executed if the referenced task is executed (i.e. is not disabled).

In the below example, when building the library `my.library` the custom `babel` task will be executed before the standard task `generateComponentPreload`.  
Another custom task called `generateMarkdownFiles` is then executed immediately after the standard task `uglify`.

### Example: Basic configuration

````yaml
# In this example configuration two custom tasks are defined: 'babel' and 'generateMarkdownFiles'.
specVersion: "2.6"
type: library
metadata:
  name: my.library
builder:
  customTasks:
    - name: babel
      beforeTask: generateComponentPreload
    - name: generateMarkdownFiles
      afterTask: uglify
      configuration:
        color: blue
````

### Example: Connect multiple custom tasks

You can also connect multiple custom tasks with each other. The order in the configuration is important in this case. You have to make sure that a task is defined *before* you reference it via `beforeTask` or `afterTask`.

````yaml
# In this example 'myCustomTask2' gets executed after 'myCustomTask1'.
specVersion: "2.6"
type: library
metadata:
  name: my.library
builder:
  customTasks:
    - name: myCustomTask1
      beforeTask: generateComponentPreload
    - name: myCustomTask2
      afterTask: myCustomTask1
````

## Custom Task Extension

A custom task extension consists of a `ui5.yaml` and a [task implementation](#task-implementation). It can be a standalone module or part of an existing UI5 project.

### Example: ui5.yaml

````yaml
specVersion: "2.6"
kind: extension
type: task
metadata:
  name: generateMarkdownFiles
task:
  path: lib/tasks/generateMarkdownFiles.js
````

Task extensions can be **standalone modules** which are handled as dependencies.

Alternatively you can implement a task extension as **part of your UI5 project**.
In that case, the configuration of the extension is part of your project configuration inside the `ui5.yaml` as shown below.

The task extension will then be automatically collected and processed during the processing of the project.

### Example: Custom Task Extension defined in UI5 project

````yaml
# Project configuration for the above example
specVersion: "2.6"
kind: project
type: library
metadata:
  name: my.library
builder:
  customTasks:
    - name: generateMarkdownFiles
      afterTask: uglify
      configuration:
        color: blue
---
# Task extension as part of your project
specVersion: "2.6"
kind: extension
type: task
metadata:
  name: generateMarkdownFiles
task:
  path: lib/tasks/generateMarkdownFiles.js
````

## Task Implementation

A custom task implementation needs to return a function with the following signature:

````javascript
/**
 * Custom task example
 *
 * @param {object} parameters Parameters
 * @param {module:@ui5/fs.DuplexCollection} parameters.workspace DuplexCollection to read and write resources
 * @param {module:@ui5/fs.AbstractReader} parameters.dependencies ReaderCollection to read dependency resources
 * @param {object} parameters.taskUtil Specification Version dependent interface to a
 *                [TaskUtil]{@link module:@ui5/builder.tasks.TaskUtil} instance
 * @param {object} parameters.options Options
 * @param {string} parameters.options.projectName Project name
 * @param {string} [parameters.options.projectNamespace] Project namespace
 * @param {string} [parameters.options.configuration] Task configuration if given in ui5.yaml
 * @returns {Promise<undefined>} Promise resolving with <code>undefined</code> once data has been written or rejecting in case of an error
 */
module.exports = async function({workspace, dependencies, taskUtil, options}) {
	// [...]
};
````

**Parameters:**

- **`workspace`**: A [DuplexCollection](https://sap.github.io/ui5-tooling/v2/api/module-@ui5_fs.DuplexCollection.html) to read and write [Resources](https://sap.github.io/ui5-tooling/v2/api/module-@ui5_fs.Resource.html) for the project that is currently being built
- **`dependencies`**: A [ReaderCollection](https://sap.github.io/ui5-tooling/v2/api/module-@ui5_fs.ReaderCollection.html) to read [Resources](https://sap.github.io/ui5-tooling/v2/api/module-@ui5_fs.Resource.html) of the project's dependencies
- **`taskUtil`**: See [details below](https://sap.github.io/ui5-tooling/pages/extensibility/CustomTasks/#helper-class-taskutil)
- **`options.projectName`**: The name of the project currently being built. *Example: `my.library`*
- **`options.projectNamespace`**: The namespace of the project. *Example: `my/library`*
- **`options.configuration`**: The task configuration as defined in the project's ui5.yaml. See [Configuration](#Configuration)


**Returns:**

A Promise that resolves once the task has completed and all new or modified resources have been written to the workspace.

In case of errors the promise should reject with an [Error object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Error), causing the build to abort. 


!!! warning
    Depending on your project setup, UI5 CLI tends to open many files simultaneously during a build. To prevent errors like `EMFILE: too many open files`, we urge custom task implementations to use the [graceful-fs](https://github.com/isaacs/node-graceful-fs#readme) module as a drop-in replacement for the native `fs` module.

### Example: lib/tasks/generateMarkdownFiles.js

The following code snippet shows an example of what a task implementation might look like. This task uses a generic "renderMarkdown" library to transform [markdown](https://daringfireball.net/projects/markdown/) files to HTML and writes out the newly created markdown files.

````javascript
const path = require("path");
const {Resource} = require("@ui5/fs");
const renderMarkdown = require("./renderMarkdown");

module.exports = async function({workspace, dependencies, taskUtil, options}) {
  const textResources = await workspace.byGlob("**/*.md")
  await Promise.all(textResources.map(async (resource) => {
    const htmlString = await renderMarkdown(await resource.getString());

    const markdownResourcePath = resource.getPath();

    // Note: @ui5/fs virtual paths are always POSIX (on all systems)
    const newResourceName = path.posix.basename(markdownResourcePath, ".md") + ".html";
    const newResourcePath = path.posix.join(path.posix.dirname(markdownResourcePath), newResourceName);

    const markdownResource = new Resource({
      path: newResourcePath,
      string: htmlString
    })
    await workspace.write(markdownResource);
  }));
};
````

### Example: lib/tasks/bundlesOnly.js

The following code snippet shows an example of a custom task, filtering for resources that are not bundles and tagging them for being omitted from the build result.

````javascript

module.exports = async function({workspace, dependencies, taskUtil, options}) {
  const jsResources = await workspace.byGlob("**/*.js")
  jsResources.forEach((resource) => {
    if (!taskUtil.getTag(resource, taskUtil.STANDARD_TAGS.IsBundle)) {
      // Resource is not a Bundle => Remove it from the build result
      taskUtil.setTag(resource, taskUtil.STANDARD_TAGS.OmitFromBuildResult);
    }
  });
};
````

## Helper Class `TaskUtil`

Custom tasks defining [Specification Version](../Configuration.md#specification-versions) 2.2 or higher have access to an interface of a [TaskUtil](https://sap.github.io/ui5-tooling/v2/api/module-@ui5_builder.tasks.TaskUtil.html) instance.

In this case, a `taskUtil` object is provided as a part of the custom task's [parameters](#task-implementation). Depending on the specification version of the custom task, a set of helper functions is available to the implementation. The lowest required specification version for every function is listed in the [TaskUtil API reference](https://sap.github.io/ui5-tooling/v2/api/module-@ui5_builder.tasks.TaskUtil.html).

Also see UI5 CLI [RFC 0008 Resource Tagging During Build](https://github.com/SAP/ui5-tooling/blob/master/rfcs/0008-resource-tagging-during-build.md) for details on resource tagging.
