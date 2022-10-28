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
 * @param {module:@ui5/fs.DuplexCollection} parameters.workspace DuplexCollection to read and write files
 * @param {module:@ui5/fs.AbstractReader} parameters.dependencies Reader or Collection to read dependency files
 * @param {object} parameters.taskUtil Specification Version dependent interface to a
 *                [TaskUtil]{@link module:@ui5/builder.tasks.TaskUtil} instance
 * @param {object} parameters.options Options
 * @param {string} parameters.options.projectName Project name
 * @param {string} [parameters.options.projectNamespace] Project namespace if available
 * @param {string} [parameters.options.configuration] Task configuration if given in ui5.yaml
 * @returns {Promise<undefined>} Promise resolving with <code>undefined</code> once data has been written
 */
module.exports = async function({workspace, dependencies, taskUtil, options}) {
	// [...]
};
````

The following code snippets shows an example how a task implementation could look like:

### Example: lib/tasks/generateMarkdownFiles.js

````javascript
// Task implementation
const markdownGenerator = require("./markdownGenerator");

module.exports = async function({workspace, dependencies, taskUtil, options}) {
	const textResources = await workspace.byGlob("**/*.txt");
	const markdownResources = await markdownGenerator({
		resources: textResources
	});
	await Promise.all(markdownResources.map((resource) => {
		return workspace.write(resource);
	}));
};
````

!!! warning
    Depending on your project setup, UI5 Tooling tends to open many files simultaneously during a build. To prevent errors like `EMFILE: too many open files`, we urge custom task implementations to use the [graceful-fs](https://github.com/isaacs/node-graceful-fs#readme) module as a drop-in replacement for the native `fs` module.


## Helper Class `TaskUtil`

Custom tasks defining [Specification Version](../Configuration.md#specification-versions) 2.2 or higher have access to an interface of a [TaskUtil](https://sap.github.io/ui5-tooling/api/module-@ui5_builder.tasks.TaskUtil.html) instance.

In this case, a `taskUtil` object is provided as a part of the custom task's [parameters](#task-implementation). Depending on the specification version of the custom task, a set of helper functions is available to the implementation. The lowest required specification version for every function is listed in the [TaskUtil API reference](https://sap.github.io/ui5-tooling/api/module-@ui5_builder.tasks.TaskUtil.html).
