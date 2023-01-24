- Start Date: 2022-10-27
- RFC PR: [#664](https://github.com/SAP/ui5-tooling/pull/664)
- Issue: -
- Affected components <!-- Check affected components by writing an "X" into the brackets -->
    + [ ] [ui5-builder](https://github.com/SAP/ui5-builder)
    + [x] [ui5-server](https://github.com/SAP/ui5-server)
    + [ ] [ui5-cli](https://github.com/SAP/ui5-cli)
    + [ ] [ui5-fs](https://github.com/SAP/ui5-fs)
    + [x] [ui5-project](https://github.com/SAP/ui5-project)
    + [ ] [ui5-logger](https://github.com/SAP/ui5-logger)


# RFC 0012 UI5 Tooling Extension API v3

## Summary
<!-- You can either remove the following explanatory text or move it into this comment for later reference -->

This **Request for Comment** summarizes potential enhancements to APIs provided to UI5 Tooling extensions. Namely [custom tasks](https://sap.github.io/ui5-tooling/pages/extensibility/CustomTasks/) and [custom middleware](https://sap.github.io/ui5-tooling/pages/extensibility/CustomServerMiddleware/).

This RFC is written in the context of the current development- and upcoming release of [UI5 Tooling version 3](https://sap.github.io/ui5-tooling/updates/migrate-v3/). This major release of UI5 Tooling brings many changes and improvements. **And a new Specification Version `3.0`.**

It is therefore reasonable that most of the new API described below will only be available to extensions defining Specification Version 3.0. However, we might decide to postpone the implementation of some features for a later version, like `3.1` or even a future major version `4.0`.

## Motivation
<!-- You can either remove the following explanatory text or move it into this comment for later reference -->

There is a great community of UI5 developers, continuously coming up with innovative solutions and improving the development experience with UI5 through the creation of UI5 Tooling extensions like custom tasks and middleware.

As of today, **the UI5 community created close to 100 extensions** for UI5 Tooling and made them available publicly on npm. This is not only a great investment of many dedicated developers but also a treasure trove for anyone working with UI5.

This RFC shall address two main topics:
1. A UI5 Tooling extension that has been written once, should continue to work as intended for as long as possible, without requiring major changes to its implementation 
2. Common requirements of extensions should be addressed by providing helpful API, reducing the implementation efforts for some extensions, while further ensuring future compatibility

## General Changes in UI5 Tooling

### 💡 Notice 1: ESM Support

With UI5 Tooling v3, extensions can be written as [ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). This is a JavaScript language feature and works independently from the defined Specification Version. Current versions of Node.js [automatically detect](https://nodejs.org/api/packages.html#determining-module-system) whether a package is ESM or not.

However, due to it's support for older Node.js versions, UI5 Tooling v2 does not support ESM extensions. Therefore we **advise all extensions that use ESM to define Specification Version 3**, in order to express their incompatibility with UI5 Tooling v2.

Extensions can still be written as CommonJS modules. Note however, that all UI5 Tooling v3 modules are ESM. Thus extensions can't "require" them anymore but have to use [(dynamic-) imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports). For more information, see also: [Sindre Sorhus: Pure ESM package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)

⚠️ **Attention** projects currently defining dependencies to UI5 Tooling modules, without specifying a version range (e.g. `@ui5/logger: "*"`): Unless your project is already ESM, your extension might break. A statement like `require("@ui5/logger")` will throw an **`ERR_REQUIRE_ESM`** exception for `@ui5/logger` v3.

An example for an ESM extension can be found here: [feat(ui5-task-flatten-library): transform to ES Modules with UI5 Tooling version 3.0.0 #648](https://github.com/ui5-community/ui5-ecosystem-showcase/pull/648)

### 💡 Notice 2: UI5 Tooling Dependency Resolution Improvements

UI5 Tooling v3 will stop using the `"ui5": { "dependencies": [...] }` package.json configuration. Instead, for the current root project, all `dependencies`, `devDependencies` and `optionalDependencies` are [automatically analyzed](https://github.com/SAP/ui5-project/blob/ff04ae4aeeb7f7d889dffd0c0e3e8774dd708c79/lib/graph/providers/NodePackageDependencies.js#L104).

In the past, `devDependencies` were not analyzed. Which made the package.json configuration necessary in many cases.

For mode details, see also the [Migrate to v3](https://sap.github.io/ui5-tooling/updates/migrate-v3/) UI5 Tooling documentation.

## Proposed Enhancements
<!-- You can either remove the following explanatory text or move it into this comment for later reference -->

### 1. Dependencies to UI5 Tooling Modules

#### Description

It is common for extensions to require UI5 Tooling modules like `@ui5/fs` or `@ui5/logger`. For example to create [`Resource`](https://sap.github.io/ui5-tooling/api/module-@ui5_fs.Resource.html) entities, or to log messages to the console.

The problem that arises with this, is **compatibility across UI5 Tooling versions**.

#### Examples

1. A `Resource` created with **`@ui5/fs` v2 is not compatible to `@ui5/fs` v3** and needs to be migrated by UI5 Tooling v3.
2. Extensions using **`@ui5/logger` v2 will use a different logger instance than UI5 Tooling v3**. This can lead to, for example, log-level configuration not being available to the extension.

#### Solution

**Dependency injection.** By providing extensions with callback functions to create resources or log messages, the extension can remove problematic dependencies like `@ui5/fs` or `@ui5/logger` from their package.json.

In a future **UI5 Tooling version 4**, extensions defining **Specification Version 3** would then still receive the expected `Resource` and `Logger` APIs, thus staying compatible while UI5 Tooling v4 makes internal enhancements and changes to the APIs.

The new APIs should be provided via the existing helper classes [`taskUtil`](https://sap.github.io/ui5-tooling/api/module-@ui5_builder.tasks.TaskUtil.html) and [`middlewareUtil`](https://sap.github.io/ui5-tooling/api/module-@ui5_server.middleware.MiddlewareUtil.html).

#### New API
* New parameter **log**
    * The provided logger instance will automatically have the name of the custom task or middleware.
    * Additional sub-loggers can be crated using `log.createSubLogger("name suffix")`
* taskUtil|middlewareUtil.**resourceFactory.createResource(**_{...}_**)**
    * Creates and returns a `Resource` with an interface signature according to the Specification Version of the extension.
    * This implies a new `resourceFactory` object which provides Specification Version-dependent access to functions of the [`@ui5/fs/resourceFactory`](https://sap.github.io/ui5-tooling/api/module-@ui5_fs.resourceFactory.html)

#### Solution Example

Migrating the custom task example from our current [documentation](https://sap.github.io/ui5-tooling/pages/extensibility/CustomTasks/#example-libtasksgeneratemarkdownfilesjs) to make use of the new API could look like this:

```patch
const path = require("path");
-const {Resource} = require("@ui5/fs");
-const log = require("@ui5/logger").getLogger("builder:customtask:markdown");
const renderMarkdown = require("./renderMarkdown");

-module.exports = async function({workspace, dependencies, taskUtil, options}) {
+module.exports = async function({workspace, dependencies, log, taskUtil, options}) {
+  const {createResource} = taskUtil.resourceFactory;
  const textResources = await workspace.byGlob("**/*.md")
  await Promise.all(textResources.map(async (resource) => {
    const htmlString = await renderMarkdown(await resource.getString());

    const markdownResourcePath = resource.getPath();
    log.info(`Rendering markdown file ${markdownResourcePath}...`) // Provided logger will automatically have a name like "builder:custom-task:generateMarkdownFiles"

    // Note: @ui5/fs virtual paths are always POSIX (on all systems)
    const newResourceName = path.posix.basename(markdownResourcePath, ".md") + ".html";
    const newResourcePath = path.posix.join(path.posix.dirname(markdownResourcePath), newResourceName);

-    const markdownResource = new Resource({
+    const markdownResource = createResource({
      path: newResourcePath,
      string: htmlString
    });
    await workspace.write(markdownResource);
  }));
};
```

### 2. Access to Project Information

#### Description

Extensions can not access information about the current project directly. Except for what is provided via the `options` argument (namely `projectName`and `projectNamespace`) or in the extension's configuration.

#### Examples

See issue [Access package.json in custom task #360](https://github.com/SAP/ui5-tooling/issues/360#issuecomment-737717601).

#### Solution

UI5 Tooling v3 has switched the internal project handling from a JSON-hierarchy to a graph of project-entities. Extensions should get access to both. With a well-defined, specification version dependent interface.

#### New API
* taskUtil|middlewareUtil.**getProject(**_projectName|resource_**)**
    * If no parameter is provided: Retrieves the project currently being built from the graph
    * If a project name is provided: Retrieves a project from the graph by name
    * If a resource instance is provided: Retrieves the project the resource belongs to from the graph
* taskUtil|middlewareUtil.**getDependencies(**_projectName_**)**
    * Returns the project names of all direct dependencies of the given project
    
`Project` interface for Specification Version 3:

* `getType`: Returns the type of the project. E.g. "library", "application", etc.
* `getName`: Returns the name of the project
* `getNamespace`: Returns the detected namespace of the project. E.g. `x/y/z`
* `getVersion`: Typically returns the package.json version of the project
* `getRootReader`: Returns an `@ui5/fs/AbsatractReader` instance for the root directory of the project. Typically the same directory that contains the ui5.yaml
* `getReader`: Returns an `@ui5/fs/AbsatractReader` instance for the resources of the project
* `getCustomConfiguration`: Returns the custom configuration of the project
* `isFrameworkProject`: Returns true if the project is a UI5 framework (theme-)library

#### Solution Example

```javascript
module.exports = async function({workspace, dependencies, taskUtil, options}) {
  const currentProject = taskUtil.getProject();
  const eslintConfig = await currentProject.getRootReader().byPath(".eslintrc");
  // Do something fun with the eslint file of the project that is currently being built

  // [...]

  const dependencyProjects = taskUtil.getDependencies(options.projectName).map((dependencyName) => {
    return taskUtil.getProject(dependencyName);
  });
  // Do something with the direct dependencies. For example collect their versions using dependencyProjects[n].getVersion()
};
```

### 3. Tasks Requiring Dependencies

#### Description

With UI5 Tooling v3, tasks can rely on the fact that the resources provided by dependencies are always built. With UI5 Tooling v2, this was only the fact if the build command specified dependencies to be built (e.g. `ui5 build --all`).

However, in order to optimize the build time, UI5 Tooling v3 now differentiates between tasks that only make use of a project's resources and those that also require dependency resources.

#### Examples

* A task that renders all markdown files of a project to HTML, **does not need to access the resources of any of the project's dependencies.**
* A task that bundles required CSS files from the project and some dependencies, **requires access to the resources of those dependencies.**

#### Solution

Custom tasks defining Specification Version 3.0 shall not receive a `dependencies` AbstractReader, unless they request dependencies to be available to them. They can do so by exporting an additional callback function `determineRequiredDependencies`. Before the task is executed, this function will be called with the current build parameters and available dependencies. It can then return an array of dependencies if requires access to. Or an empty array if no dependency access is required.

By default, legacy custom tasks defining Specification Versions **lower than 3.0** are expected to require dependencies. However, even they can provide the described callback to opt-out.

#### New API

* Custom task export: *async* **determineRequiredDependencies(**_{availableDependencies, getProject, getDependencies, options}_**)**
    * `availableDependencies`: [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) containing the names of all direct dependencies of the project currently being built. For example by returning it unmodified, all dependencies will be available to the task.
    * `getProject`, `getDependencies`: Identical to [`taskUtil.getProject` and `taskUtil.getDependencies`](#2-access-to-project-information)
    * `options`: Same as for the main task function. `{projectName, projectNamespace, configuration, taskName}`
    * Returns: List of dependencies that should be made available to the task. UI5 Tooling will ensure that those dependencies have been built before executing the task.

#### Solution Example

```javascript
module.exports = async function({workspace, dependencies, taskUtil, options}) {
  // Task implementation
};

module.exports.determineRequiredDependencies = async function({availableDependencies, getProject, getDependencies, options})}) {
  // "availableDependencies" could look like this: ["sap.ui.core", "sap.m", "my.lib"]

  // One could for example ignore all framework libraries:
  availableDependencies.forEach((depName) => {
    if (getProject(depName).isFrameworkProject()) {
        availableDependencies.delete(depName)
    }
  });
  // => Only resources of project "my.lib" will be available to the task
  return availableDependencies;
};
```

### 4. Middleware Serving Resources

#### Description

Custom middleware that would like to respond with an `@ui5/fs/Resource` needs to implement a lot of common logic in order to properly do that. I.e. the correct content type and E-Tag headers need to be set.

Custom middleware should be provided with a helper function to serve resources efficiently.

#### Examples

See the logic for serving a resource in the standard @ui5/server middleware "serveResources":  
[`serveResources.js#L65-L93`](https://github.com/SAP/ui5-server/blob/4bfcf012bb723814cf35c7ef79eb13082117e3d2/lib/middleware/serveResources.js#L65-L93)

Custom (community) middleware "ui5-middleware-stringreplacer" has to implement almost the same logic for serving a resource itself:  
[`stringreplacer.js#L135-L161`](https://github.com/ui5-community/ui5-ecosystem-showcase/blob/839bb48f50ad55461b84cc794c6d38aaee385fbe/packages/ui5-middleware-stringreplacer/lib/stringreplacer.js#L135-L161)

#### Solution

`middlewareUtil` should provide a convenience method to respond with the content of an `@ui5/fs/Resource`.

#### New API

* *async* middlewareUtil.**sendResource(**_res, resource_**)**

#### Solution Example

```javascript
module.exports = function({resources, middlewareUtil, options}) {
    return function (req, res, next) {
        resources.rootProject.byPath("index.html").then((resource) => {
            await middlewareUtil.sendResource(res, resource);
        }
    }
};
```

### 5. Scheduling of Extension Executions

#### Description

Provide a better way for extensions to define a time of execution. Remove the implicit dependency on standard or custom tasks/middleware for the execution order, or for being executed at all.

#### Examples

```yaml
specVersion: "2.6"
kind: project
type: application
metadata:
  name: my.application
server:
  customTasks:
    - name: generateMarkdownFiles
      afterTask: buildThemes
```

#### Solution

Introduce "Build Phases" for common scheduling of custom tasks:

Build Phase | Standard Tasks in that Phase
:----: | ----
_Pre-Build_ | *none*
| | |
_Pre-Prepare-Sources_ | *none*
**Prepare-Sources** | escapeNonAsciiCharacters, replaceCopyright, replaceVersion, replaceBuildtime, minify
_Post-Prepare-Sources_ | *none*
| | |
_Pre-Create-Bundles_ | *none*
**Create-Bundles** | generateFlexChangesBundle, generateManifestBundle,<br/>generateLibraryManifest, generateComponentPreload,<br/>generateLibraryPreload, generateStandaloneAppBundle
_Post-Create-Bundles_ | transformBootstrapHtml
| | |
_Pre-Build-Themes_ | *none*
**Build-Themes** | buildThemes
_Post-Build-Themes_ | generateThemeDesignerResources
| | |
_Post-Build_ | generateVersionInfo, generateVersionInfo, generateApiIndex, generateResourcesJson

The custom task configuration can reference a build phase and define whether the task should be executed at the *start* or at the *end* of a given phase. If multiple custom tasks are defined for the same execution time, the order of their definition in the ui5.yaml configuration is relevant.

**TODO/To be decided:** Provide similar phases for server middleware?

#### Solution Example

```yaml
specVersion: "2.6"
kind: project
type: application
metadata:
  name: my.application
server:
  customTasks:
    - name: generateMarkdownFiles
      phase: post-build
      phase-order: start
```

### 6. Restrictions for Project and Extension Names

#### Description

Project- and Extension-names are currently unrestricted. Some boundaries should be applied to align names in general, and to ensure future compatibility.

Additionally, extensions can take the same names as standard tasks or middleware. This can lead to confusion and issues. Especially when new standard elements are introduced in UI5 Tooling, there is a risk of having name clashes with existing extensions.

Note that projects typically do not have this issue, since they are commonly follow a namespace-like structure.

#### Examples

Currently, projects and extensions can define names with any characters (including special characters), of unrestricted length.

These names are used in various placed within UI5 Tooling. Certain names can have unintended side-effects. Worst-case, they can lead to security issues.

#### Solution

New boundary conditions for names of projects and extensions (as defined in the metadata.name attribute):

* Names must start lowercase
* Names must start with an alphabetic characters
* Names must only contain alphanumeric characters, dashes and underscores
* Names must be no longer than 50 characters

Similar restrictions should be implemented for other configurations too.

#### To be Discussed

* This would disallow the use of any UTF-8 characters. Including Chinese characters, Emojis, etc. Is this still matching with developer expectations?

#### Prior-Art

* **[Kubernetes Object Names and IDs:](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/)**
  > * contain at most 63 characters  
  > * contain only lowercase alphanumeric characters or '-'  
  > * start with an alphanumeric character  
  > * end with an alphanumeric character  
* **[Docker Tags:](https://docs.docker.com/engine/reference/commandline/tag/)**
  > A tag name must be valid ASCII and may contain lowercase and uppercase letters, digits, underscores, periods and dashes. A tag name may not start with a period or a dash and may contain a maximum of 128 characters.

### 7. Provide Extension Name *(minor)*

#### Description

If multiple extension definitions share the same implementation, it would be beneficial to have the configured name available at runtime.

#### Examples

See issue [TaskUtil to expose the current tasks name #545](https://github.com/SAP/ui5-tooling/issues/545#issue-975525925)

#### Solution

Enhance `options` object passed to custom task or middleware with a new attribute **`taskName`** or **`middlewareName`** containing the name configured in the corresponding ui5.yaml (not the runtime name, which might have a suffix like `taskName-1` if multiple executions are scheduled).

#### Solution Example

```javascript
module.exports = async function({workspace, dependencies, taskUtil, options}) {
  const taskName = options.taskName;
};
```

## How we teach this
<!-- You can either remove the following explanatory text or move it into this comment for later reference -->

Enhanced UI5 Tooling documentation for custom tasks and custom middleware. Updated API reference.

## Drawbacks
<!-- You can either remove the following explanatory text or move it into this comment for later reference -->

Introducing new API for extensions always bears the risk of hindering future development of UI5 Tooling due to compatibility constrains.

## Unresolved Questions and Bikeshedding
<!-- You can either remove the following explanatory text or move it into this comment for later reference -->

*This section should be removed (i.e. resolved) before merging*

* The [naming restrictions](#6-restrictions-for-project-and-extension-names) should be discussed in more detail
