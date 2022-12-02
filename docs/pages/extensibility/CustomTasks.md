# Custom UI5 Builder Tasks

The UI5 Build Extensibility enables you to enhance the build process of any UI5 project. In addition to the [standard tasks](../Builder.md#standard-tasks), custom tasks can be created.

The UI5 community already created many custom tasks which you can integrate into your project. They are often prefixed by `ui5-task-` to make them easily searchable in the [npm registry](https://www.npmjs.com/search?q=ui5-task-).

Please note that custom tasks from third parties can not only modify your project but also execute arbitrary code on your system. In fact, this is the case for all npm packages you install. Always act with the according care and follow best practices.

## Configuration

You can configure your build process with additional build task. These custom tasks are defined in the project [configuration](../Configuration.md).

To hook your custom tasks into the different build phases of a project, they need to reference other tasks to be executed before or after. This can be a [standard task](../Builder.md#standard-tasks) or another custom task. Note that a custom task will only be executed if the referenced task is executed (i.e. is not disabled).

In the below example, when building the library `my.library` the custom `babel` task will be executed before the standard task `generateComponentPreload`.  
Another custom task called `renderMarkdownFiles` is then executed immediately after the standard task `uglify`.

### Example: Basic configuration

````yaml
# In this example configuration two custom tasks are defined: 'babel' and 'renderMarkdownFiles'.
specVersion: "3.0"
type: library
metadata:
  name: my.library
builder:
  customTasks:
    - name: babel
      beforeTask: generateComponentPreload
    - name: renderMarkdownFiles
      afterTask: uglify
      configuration:
        markdownStyle:
            firstH1IsTitle: true
````

### Example: Connect multiple custom tasks

You can also connect multiple custom tasks with each other. The order in the configuration is important in this case. You have to make sure that a task is defined *before* you reference it via `beforeTask` or `afterTask`.

````yaml
# In this example 'myCustomTask2' gets executed after 'myCustomTask1'.
specVersion: "3.0"
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
specVersion: "3.0"
kind: extension
type: task
metadata:
  name: renderMarkdownFiles
task:
  path: lib/tasks/renderMarkdownFiles.js
````

Task extensions can be **standalone modules** which are handled as dependencies.

Alternatively you can implement a task extension as **part of your UI5 project**.
In that case, the configuration of the extension is part of your project configuration inside the `ui5.yaml` as shown below.

The task extension will then be automatically collected and processed during the processing of the project.

### Example: Custom Task Extension defined in UI5 project

````yaml
# Project configuration for the above example
specVersion: "3.0"
kind: project
type: library
metadata:
  name: my.library
builder:
  customTasks:
    - name: renderMarkdownFiles
      afterTask: uglify
      configuration:
        markdownStyle:
            firstH1IsTitle: true
---
# Task extension as part of your project
specVersion: "3.0"
kind: extension
type: task
metadata:
  name: renderMarkdownFiles
task:
  path: lib/tasks/renderMarkdownFiles.js
````

## Task Implementation

A custom task implementation needs to return a function with the following signature:

````javascript
/**
 * Custom task API
 *
 * @param {object} parameters Parameters
 * @param {module:@ui5/fs.DuplexCollection} parameters.workspace
 *      Reader/Writer to access and modify resources of the
 *      project currently being built
 * @param {module:@ui5/fs.AbstractReader} parameters.dependencies
 *      Reader to access resources of the project's dependencies
 * @param {@ui5/builder.tasks.TaskUtil} parameters.taskUtil
 *      Specification Version-dependent interface to a TaskUtil instance.
 *      See the corresponding API reference for details.
 * @param {@ui5/logger/GroupLogger} parameters.log
 *      Logger instance for use in the custom task.
 *      This parameter is only available to custom task extensions
 *      defining Specification Version 3.0 and later.
 * @param {object} parameters.options Options
 * @param {string} parameters.options.projectName
 *      Name of the project currently being built
 * @param {string} parameters.options.projectNamespace
 *      Namespace of the project currently being built
 * @param {string} parameters.options.configuration
 *      Custom task configuration, as defined in the project's ui5.yaml
 * @param {string} parameters.options.taskName
 *      Name of the custom task.
 *      This parameter is only provided to custom task extensions
 *      defining Specification Version 3.0 and later.
 * @returns {Promise<undefined>}
 *      Promise resolving once the task has finished
 */
module.exports = async function({workspace, dependencies, taskUtil, options}) {
	// [...]
};
````

The following code snippets shows an example how a task implementation could look like:

### Example: lib/tasks/renderMarkdownFiles.js

````javascript
const path = require("path");
const renderMarkdown = require("./renderMarkdown");

/*
 * Render all .md (Markdown) files in the project to HTML
 */
module.exports = async function({workspace, dependencies, log, taskUtil, options}) {
	const {createResource} = taskUtil.resourceFactory;
	const textResources = await workspace.byGlob("**/*.md")
	await Promise.all(textResources.map(async (resource) => {
		const markdownResourcePath = resource.getPath();

		log.info(`Rendering markdown file ${markdownResourcePath}...`);
		const htmlString = await renderMarkdown(await resource.getString(), options.configuration);

		// Note: @ui5/fs virtual paths are always (on *all* platforms) POSIX. Therefore using path.posix here
		const newResourceName = path.posix.basename(markdownResourcePath, ".md") + ".html";
		const newResourcePath = path.posix.join(path.posix.dirname(markdownResourcePath), newResourceName);

		const markdownResource = createResource({
			path: newResourcePath,
			string: htmlString
		});
		await workspace.write(markdownResource);
	}));
};
````

!!! warning
    Depending on your project setup, UI5 Tooling tends to open many files simultaneously during a build. To prevent errors like `EMFILE: too many open files`, we urge custom task implementations to use the [graceful-fs](https://github.com/isaacs/node-graceful-fs#readme) module as a drop-in replacement for the native `fs` module in case it is used.
    In general, tasks should try to use the provided reader/writer APIs for working with project resources.

### Example: lib/tasks/compileLicenseSummary.js

````javascript
const path = require("path");

/*
 * Compile a list of all licenses of the project's dependencies
 * and write it to "dependency-license-summary.json"
 */
module.exports = async function({workspace, dependencies, log, taskUtil, options}) {
	const {createResource} = taskUtil.resourceFactory;
	const licenses = new Map();
	const projectsVisited = new Set();

	async function processProject(project) {
		return Promise.all(taskUtil.getDependencies().map(async (projectName) => {
			if (projectsVisited.has(projectName)) {
				return;
			}
			projectsVisited.add(projectName);
			const project = taskUtil.getProject(projectName);
			const pkgResource = await project.getRootReader().byPath("/package.json");
			if (pkgResource) {
				const pkg = JSON.parse(await pkgResource.getString())

				// Add project to list of licenses
				if (licenses.has(pkg.license)) {
					licenses.get(pkg.license).push(project.getName());
				} else {
					// License not yet in map. Define it
					licenses.set(pkg.license, [project.getName()]);
				}

			} else {
				log.info(`Could not find package.json file in project ${project.getName()}`);
			}
			return processProject(project);
		}));
	}
	// Start processing dependencies of the root project
	await processProject(taskUtil.getProject());

	const summaryResource = createResource({
		path: "/dependency-license-summary.json",
		string: JSON.stringify(Object.fromEntries(licenses), null, "\t")
	});
	await workspace.write(summaryResource);
};
````

## Helper Class `TaskUtil`

Custom tasks defining [Specification Version](../Configuration.md#specification-versions) 2.2 or higher have access to an interface of a [TaskUtil](https://sap.github.io/ui5-tooling/api/module-@ui5_builder.tasks.TaskUtil.html) instance.

In this case, a `taskUtil` object is provided as a part of the custom task's [parameters](#task-implementation). Depending on the specification version of the custom task, a set of helper functions is available to the implementation. The lowest required specification version for every function is listed in the [TaskUtil API reference](https://sap.github.io/ui5-tooling/api/module-@ui5_builder.tasks.TaskUtil.html).
