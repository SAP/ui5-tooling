# Migrate to v3

!!! warning
    **UI5 Tooling v3 is currently in development.** Further breaking changes are expected.  
    The latest development version can be installed via `npm i --save-dev @ui5/cli@next`

## Node.js and npm Version Support

**Only Node.js v16.18.0 and npm v8 or higher are supported.**
Support for older Node.js and npm releases has been dropped.

## Specification Versions Support

Going forward, **only projects with Specification Versions 2.0 and higher are supported.**

In case a legacy specification version is detected, **an automatic migration is attempted.**
This means your old projects might still work. Unless they have non-standard configuration in their ui5.yaml.

## Changes for Extensions

!!! info
    ✅ Custom Tasks and -Middleware defining **Specification Version 2.x and lower** are expected to be **fully compatible with UI5 Tooling v3**

For extensions defining the latest **Specification Versions 3.0 and higher**, some changes and improvements apply:

* **Breaking Change:** Custom Tasks need to request access to dependency resources
    * By default, resources of dependencies can't be accessed. A custom task requiring such access needs to implement a callback function `determineRequiredDependencies`, in which it can also define the scope of dependency-access. Please refer to the [Custom Task: Required Dependencies documentation](../pages/extensibility/CustomTasks.md#required-dependencies)
* **Features:** Enhanced TaskUtil and MiddlewareUtil API
    * For example providing access to a [project's root directory](https://sap.github.io/ui5-tooling/v3/api/@ui5_project_build_helpers_TaskUtil.html#~ProjectInterface), or [dependencies](https://sap.github.io/ui5-tooling/v3/api/@ui5_project_build_helpers_TaskUtil.html#getDependencies)
    * See also [Custom Tasks](../pages/extensibility/CustomTasks.md) and [Custom Server Middleware](../pages/extensibility/CustomServerMiddleware.md)

## Changes to @ui5/project and @ui5/builder API

The `normalizer` and `projectTree` modules have been removed. The `builder` API has been moved from @ui5/builder to @ui5/project.

The JSON based, internal representation of a project dependency tree has been replaced with a graph. This is the result of a major refactoring of @ui5/project which lead to a series of API changes.

!!! info
    ✅ The **`ui5.dependencies` package.json configuration** becomes obsolete and is ignored in UI5 Tooling v3.

    Configuration like the following is not needed anymore:

    ```diff title="package.json"
    {
    	[...]
    - 	  "ui5": {
	-	    "dependencies": [
	-	      "my-package"
	-	    ]
	-	  }
		[...]
    }
    ```

    `dependencies`, `devDependencies` and `optionalDependencies` are now [automatically analyzed](https://github.com/SAP/ui5-project/blob/ff04ae4aeeb7f7d889dffd0c0e3e8774dd708c79/lib/graph/providers/NodePackageDependencies.js#L104).
    If a dependency can be configured as a UI5 project or UI5 Tooling extension, it is added to the graph and it's `dependencies` are analyzed.

    Note that `devDependencies` and `optionalDependencies` are ignored for all but the current root project. For project's that are intended to be consumed in other projects (for example libraries), this means that any required custom tasks must be added to `dependencies`.

### Migrating Your Code

**Old: @ui5/project v2**

````javascript
const {normalizer} = require("@ui5/project");
const {builder} = require("@ui5/builder");

const tree = await normalizer.generateProjectTree({cwd: "."});

await builder.build({
    tree,
    destPath: "./dist",
    buildDependencies: true,
});
````

**New: @ui5/project v3**

````javascript
import {graphFromPackageDependencies} from "@ui5/project/graph";

let graph = await graphFromPackageDependencies({cwd: "."});

await graph.build({
    destPath: "./dist",
    includedDependencies: ["*"], // Parameter "buildDependencies" has been removed
});
````

Also the @ui5/server API has been changed. Instead of a `tree`, it now only accepts a `graph` instance as the first parameter.

## JSDoc Processor Fails When JSDoc Reports an Error

The `jsdocGenerator` processor and the corresponding `generateJsdoc` task will now throw an error when JSDoc reports an error (exit code != 0). This will also fail the build when running `ui5 build jsdoc`.

## Always Building Required Dependencies

If any of a project's build tasks requires access to resources of the project's dependencies, UI5 Tooling v3 will now **always build that dependency upfront**.

This ensures that tasks always access processed resources and never the raw sources of a dependency. Resulting in better reproducibility of build results and resolving common issues.

Especially for projects of type `library`, where standard tasks like [`buildThemes`](https://github.com/SAP/ui5-project/blob/b40e3f569e0f01c6dd8e72141c7ba43449812d01/lib/build/definitions/library.js#L139) always require dependency access, UI5 Tooling will now always build all dependencies.

In the future, a caching mechanism should help and improve build times with this new behavior.

!!! info
	The CLI flags `-a` and `--all` are still present and now an alias for `--include-all-dependencies`. This flag (along with `--include-dependency*` and `--exclude-dependency*`) mainly controls the **build output**. Use it to define whether dependency resources should be part of the build result.

	Please also refer to the [`ui5 build` documentation](../pages/CLI.md#ui5-build).

## Removal of Standard Tasks and Processors

The following tasks have been removed:

- createDebugFiles
- generateManifestBundle
- uglify

The following processors have been removed:

- debugFileCreator
- manifestBundler
- resourceCopier
- uglifier

**Task Migration**

| UI5 Tooling v2              | UI5 Tooling v3              | Note |
| --------------------------- | --------------------------- | ------------------------- |
| createDebugFiles<br/>uglify | minify                      | The minify task is executed earlier, before the bundling process takes place. Any existing 'beforeTask' or 'afterTask' configuration of custom tasks might need to be adapted to cater for this change. |
| generateVersionInfo         | generateVersionInfo         | The task is no longer executed by default for application projects. It can be re-enabled by using the `--include-task` parameter. |
| generateManifestBundle      | *None*                      | This task was only needed for the HTML5 repository in Cloud Foundry. Meanwhile, the HTML5 repository implemented its own mechanism, so the task is no longer needed |


**Updated list of standard tasks:**

| Task                      | Type `application` | Type `library` | Type `theme-library` |
| ------------------------- | :----------------: | :------------: | :------------------: |
| escapeNonAsciiCharacters  | *enabled*          | *enabled*      |                      |
| replaceCopyright          | *enabled*          | *enabled*      | *enabled*            |
| replaceVersion            | *enabled*          | *enabled*      | *enabled*            |
| replaceBuildtime          |                    | *enabled*      |                      |
| generateJsdoc             |                    | *disabled* ^1^ |                      |
| executeJsdocSdkTransformation |                | *disabled* ^1^ |                      |
| **ADDED:** minify         | *enabled*          | *enabled*      |                      |
| generateFlexChangesBundle |                    | *enabled*      |                      |
| **REMOVED:** ~~generateManifestBundle~~ | *~~disabled~~* | *~~disabled~~* |            |
| generateLibraryManifest   |                    | *enabled*      |                      |
| generateComponentPreload  | *enabled*          | *disabled* ^2^ |                      |
| generateLibraryPreload    |                    | *enabled*      |                      |
| generateStandaloneAppBundle | *disabled* ^3^   |                |                      |
| transformBootstrapHtml    | *disabled* ^3^     |                |                      |
| generateBundle            | *disabled* ^4^     | *disabled* ^4^ |                      |
| buildThemes               |                    | *enabled*      | *enabled*            |
| generateThemeDesignerResources |               | *disabled*     | *disabled*           |
| **REMOVED:** ~~createDebugFiles~~ | *~~enabled~~* | *~~enabled~~* |                    | 
| **REMOVED:** ~~uglify~~   | *~~enabled~~*      | *~~enabled~~*  |                      |
| generateVersionInfo       | **disabled**       |                |                      |
| generateCachebusterInfo   | *disabled*         |                |                      |
| generateApiIndex          | *disabled* ^1^     |                |                      |
| generateResourcesJson     | *disabled*         | *disabled*     | *disabled*           |

*Disabled tasks can be activated by certain build modes, the project configuration, or by using the `--include-task` [CLI parameter](../pages/CLI.md#ui5-build). See footnotes where given* 

---

^1^ Enabled in `jsdoc` build, which disables most of the other tasks  
^2^ Enabled for projects defining a [component preload configuration](../pages/Configuration.md#component-preload-generation)  
^3^ Enabled in `self-contained` build, which disables `generateComponentPreload` and `generateLibraryPreload`  
^4^ Enabled for projects defining a [bundle configuration](../pages/Configuration.md#custom-bundling)  

## Removal of Standard Middleware

The following middleware has been removed from the [standard middlewares list](../../pages/Server/#standard-middleware):

- connectUi5Proxy

**Middleware Migration**

| UI5 Tooling v2              | UI5 Tooling v3              | Note |
| --------------------------- | --------------------------- | ------------------------- |
| connectUi5Proxy | *None* | More sophisticated proxy solutions for ui5-server are now available in the form of [custom middleware extensions from the UI5-community](https://bestofui5.org/#/packages?tokens=proxy:tag). Make sure to refactor any custom middleware that attaches to `beforeMiddleware` or `afterMiddleware` of `connectUi5Proxy` to reference some other middleware. |
