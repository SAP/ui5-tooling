- Start Date: 2023-11-08
- RFC PR: [#897](https://github.com/SAP/ui5-tooling/pull/897)
- Issue: -
- Affected components <!-- Check affected components by writing an "X" into the brackets -->
    + [x] [ui5-builder](https://github.com/SAP/ui5-builder)
    + [ ] [ui5-server](https://github.com/SAP/ui5-server)
    + [ ] [ui5-cli](https://github.com/SAP/ui5-cli)
    + [ ] [ui5-fs](https://github.com/SAP/ui5-fs)
    + [x] [ui5-project](https://github.com/SAP/ui5-project)
    + [ ] [ui5-logger](https://github.com/SAP/ui5-logger)


# RFC 0014 Task Workers

## Summary
<!-- You can either remove the following explanatory text or move it into this comment for later reference -->

Concept for a new API provided to UI5 Tooling build tasks, enabling easy use of Node.js [Worker Threads](https://nodejs.org/api/worker_threads.html) to execute CPU intensive operations outside of the main thread.

## Motivation
<!-- You can either remove the following explanatory text or move it into this comment for later reference -->

The two existing tasks `minify` and `buildThemes` should share the same pool of [workers](https://nodejs.org/api/worker_threads.html) so that there is no unnecessary teardown/startup of workers during a build.

The pool should also be re-used when multiple projects are being built, either in a `ui5 build --all` scenario, or concurrent project builds (as suggested in https://github.com/SAP/ui5-tooling/issues/894) within the same Node.js process to prevent creating multiple workerpools which might slow down the overall build or even system performance.

## Detailed design
<!-- You can either remove the following explanatory text or move it into this comment for later reference -->

### Terminology

* `Worker`: A Node.js [Worker thread](https://nodejs.org/api/worker_threads.html) instance
* `Build Task`: A UI5 Tooling build task such as "minify" or "buildThemes" (standard tasks) or any [custom task](https://sap.github.io/ui5-tooling/stable/pages/extensibility/CustomTasks/)
* `Task Processor`: A module associated with a UI5 Tooling Build Task (standard or custom) that can be executed in a `Worker`
* `Dispatch Broker`: A ui5-project module coupled to the lifecycle of a Graph Build (similar to the `ProjectBuildContext`). It forwards requests from Build Tasks
* `Thread Runner`: A ui5-project module that will be loaded in a `Worker`. It handles communication with the main thread and executes a `Task Processor` on request
* `Dispatcher`: A ui5-project singleton module which uses a library like [`workerpool`](https://github.com/josdejong/workerpool) to spawn and manage `Worker` instances in order to have them execute any `Task Processor` requested by the Build Task
	- Handles the `Worker` lifecycle

![](./resources/0014-task-workers.png)

### Key Design Decisions

* Task Processors shall be called with a well defined signature as described [below](#task-processor)
* A Task Processor should not be exposed to Worker-specific API
	- I.e. it can be executed on the main thread as well as in a Worker
* The Work Dispatcher and Thread Runner modules will handle all inter-process communication
	- This includes serializing and de-serializing `@ui5/fs/Resource` instances
* Custom tasks can opt into this feature by defining one ore more "Task Processor" modules in its ui5.yaml
* A Task can only invoke its own Task Processor(s)

### Assumptions

* A Task Processor is assumed to utilize a CPU thread by 90-100%
	- Accordingly they are also assumed to execute little to no I/O operations
	- This means one Worker should never execute more than one Task Processor at the same time
* A Task Processor is stateless

### Task Processor

Similar to Tasks, Task Processors shall be invoked with a well defined signature:

* `resources`: An array of `@ui5/fs/Resource` provided by the Build Task
* `options`: An object provided by the build task
* `workspace`: Reader to read project files
* `dependencies`: Reader or collection to read dependency files

```js
/**
 * Task Processor example
 *
 * @param {Object} parameters Parameters
 * @param {DuplexCollection} parameters.workspace DuplexCollection to read and write files
 * @param {AbstractReader} parameters.dependencies Reader or Collection to read dependency files
 * @param {Object} parameters.options Options provided by the calling task
 * @returns {Promise<object>} Promise resolving with an object containing the result of the process in an arbitrary format
 */
module.exports = function({resources, workspace, dependencies, options}) {
    // [...]
};
````

### Task Configuration


```yaml
specVersion: "3.3"
kind: extension
type: task
metadata:
    name: pi
task:
    path: lib/tasks/pi.js
    processors:
    	computePi: lib/tasks/piProcessor.js
```


### Task API

```js
/**
 * Custom task example
 *
 * @param {Object} parameters Parameters
 * @param {DuplexCollection} parameters.workspace DuplexCollection to read and write files
 * @param {AbstractReader} parameters.dependencies Reader or Collection to read dependency files
 * @param {Object} parameters.options Options
 * @param {string} parameters.options.projectName Project name
 * @param {string} [parameters.options.configuration] Task configuration if given in ui5.yaml
 * @param {object} processors
 * @returns {Promise<undefined>} Promise resolving with undefined once data has been written
 */
module.exports = function({workspace, options, processors}) {
    const res = await processors.execute("computePi", {
    	options: {
    		digits: 1000000
    	},
    	workspace, // optional overwrite of the workspace parameter
    	dependencies, // optional overwrite of the dependencies parameter
    });
   // [...] 
};
````


## How we teach this
<!-- You can either remove the following explanatory text or move it into this comment for later reference -->

**TODO**

## Drawbacks
<!-- You can either remove the following explanatory text or move it into this comment for later reference -->

**TODO**

## Alternatives
<!-- You can either remove the following explanatory text or move it into this comment for later reference -->

**TODO**

## Unresolved Questions and Bikeshedding
<!-- You can either remove the following explanatory text or move it into this comment for later reference -->

*This section should be removed (i.e. resolved) before merging*

**TODO**
