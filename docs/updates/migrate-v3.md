# Migrate to v3

!!! warning
    **UI5 Tooling v3 is currently in development.** Further breaking changes are expected.  
    The latest development version can be installed via `npm i --save-dev @ui5/cli@next`

## Node.js and npm Version Support

**Only Node.js v16.13.2 and npm v8 or higher are supported.**
Support for older Node.js and npm releases has been dropped.

## Specification Versions Support

Going forward, **only projects with Specification Versions 2.0 and higher are supported.**

In case a legacy specification version is detected, **an automatic migration is attempted.**
This means your old projects might still work. Unless they have non-standard configuration in their ui5.yaml.

## Changes to @ui5/project and @ui5/builder APIs

The `normalizer` and `projectTree` APIs have been removed. The `builder` API has been moved from @ui5/builder to @ui5/project.

The JSON based, internal representation of a project dependency tree has been replaced with a graph. This resulted in a major refactoring of @ui5/project and made us change the APIs in an incompatible way.

!!! note
    The `ui5.dependencies` package.json configuration becomes obsolete and is ignored in UI5 Tooling v3.

    `dependencies`, `devDependencies` and `optionalDependencies` are [automatically analyzed](https://github.com/SAP/ui5-project/blob/ff04ae4aeeb7f7d889dffd0c0e3e8774dd708c79/lib/graph/providers/NodePackageDependencies.js#L104).
    If a dependency can be configured as a UI5 project or UI5 Tooling extension, it is added to the graph and it's `dependencies` are analyzed.

    Note that `devDependencies` and `optionalDependencies` are ignored for all but the current root project.

Note that also the @ui5/server API has been changed. Instead of a `tree`, it now only accepts a `graph` instance as the first parameter.

## JSDoc processor now fails when JSDoc reports an error

The `jsdocGenerator` processor and the corresponding `generateJsdoc` task will now throw an error when JSDoc reports an error (exit code != 0). This will also fail the build when running `ui5 build jsdoc`.

### Migrating Your Code

**@ui5/project v2**

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

**@ui5/project v3**

````javascript
const {generateProjectGraph} = require("@ui5/project");

let graph = await generateProjectGraph.usingNodePackageDependencies({cwd: "."});

await graph.build({
    destPath: "./dist",
    includedDependencies: ["*"], // Parameter "buildDependencies" has been removed
});
````

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
