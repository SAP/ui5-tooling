# Migrate to v3

!!! warning
    UI5 Tooling v3 is currently in development. Further breaking changes are expected.  
    The latest development version can be installed via `npm i -D @ui5/cli@next`

## Breaking changes

**All UI5 Tooling Modules Require Node.js >= 16.13.2 / npm >= 8**

Support for older Node.js and npm releases has been dropped.
Only Node.js v16.13.2 and npm v8 or higher are supported.

**Removal of tasks and processors**

The following tasks have been removed:

- createDebugFiles
- uglify

The following processors have been removed:

- debugFileCreator
- resourceCopier
- uglifier

As a replacement, the new 'minify' task and 'minifier' processor can be
used.

Note: The minify task is executed earlier, before the bundling
process takes place. Any existing 'beforeTask' or 'afterTask' configuration of
custom tasks might need to be adapted to cater for this change.

Updated list of standard tasks:

| Task | Type `application` | Type `library` | Type `theme-library` |
| ---- | :----: | :----: | :----: |
| escapeNonAsciiCharacters | *enabled* | *enabled* |  |
| replaceCopyright | *enabled* | *enabled* | *enabled* |
| replaceVersion | *enabled* | *enabled* | *enabled* |
| replaceBuildtime |  | *enabled* |  |
| generateJsdoc |  | *disabled* ^1^ |  |
| executeJsdocSdkTransformation |  | *disabled* ^1^ |  |
| **ADDED:** minify | *disabled* | *disabled* |  |
| generateFlexChangesBundle |  | *enabled* |  |
| generateManifestBundle | *disabled* | *disabled* |  |
| generateLibraryManifest |  | *enabled* |  |
| generateComponentPreload | *enabled* | *disabled* ^2^ |  |
| generateLibraryPreload |  | *enabled* |  |
| generateStandaloneAppBundle | *disabled* ^3^ |  |  |
| transformBootstrapHtml | *disabled* ^3^ |  |  |
| generateBundle | *disabled* ^4^ | *disabled* ^4^ |  |
| buildThemes |  | *enabled* | *enabled* |
| generateThemeDesignerResources |  | *disabled* | *disabled* |
| **REMOVED:** ~~createDebugFiles~~ |  |  |  |
| **REMOVED:** ~~uglify~~ |  |  |  |
| generateVersionInfo | *enabled* |  |  |
| generateCachebusterInfo | *disabled* |  |  |
| generateApiIndex | *disabled* ^1^ |  |  |
| generateResourcesJson | *disabled* | *disabled* | *disabled* |

*Disabled tasks be activated by certain build modes, the project configuration, or by using the `--include-task` [CLI parameter](../pages/CLI.md#ui5-build). See footnotes where given* 

---

^1^ Enabled in `jsdoc` build, which disables most of the other tasks  
^2^ Enabled for projects defining a [component preload configuration](../pages/Configuration.md#component-preload-generation)  
^3^ Enabled in `self-contained` build, which disables `generateComponentPreload` and `generateLibraryPreload`  
^4^ Enabled for projects defining a [bundle configuration](../pages/Configuration.md#custom-bundling)  
