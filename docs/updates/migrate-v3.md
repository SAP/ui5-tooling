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
| escapeNonAsciiCharacters | {: .sap-icon-circle-task-2 } | {: .sap-icon-circle-task-2 } |  |
| replaceCopyright | {: .sap-icon-circle-task-2 } | {: .sap-icon-circle-task-2 } | {: .sap-icon-circle-task-2 } |
| replaceVersion | {: .sap-icon-circle-task-2 } | {: .sap-icon-circle-task-2 } | {: .sap-icon-circle-task-2 } |
| replaceBuildtime |  | {: .sap-icon-circle-task-2 } |  |
| generateJsdoc |  | {: .sap-icon-circle-task }^1^ |  |
| executeJsdocSdkTransformation |  | {: .sap-icon-circle-task }^1^ |  |
| generateFlexChangesBundle |  | {: .sap-icon-circle-task-2 } |  |
| generateManifestBundle | {: .sap-icon-circle-task } | {: .sap-icon-circle-task } |  |
| **ADDED:** minify | {: .sap-icon-circle-task } | {: .sap-icon-circle-task } |  |
| generateLibraryManifest |  | {: .sap-icon-circle-task-2 } |  |
| generateLibraryPreload |  | {: .sap-icon-circle-task-2 } |  |
| generateComponentPreload | {: .sap-icon-circle-task-2 } | {: .sap-icon-circle-task }^2^ |  |
| generateStandaloneAppBundle | {: .sap-icon-circle-task }^3^ |  |  |
| transformBootstrapHtml | {: .sap-icon-circle-task }^3^ |  |  |
| generateBundle | {: .sap-icon-circle-task }^4^ | {: .sap-icon-circle-task }^4^ |  |
| buildThemes |  | {: .sap-icon-circle-task-2 } | {: .sap-icon-circle-task-2 } |
| generateThemeDesignerResources |  | {: .sap-icon-circle-task } | {: .sap-icon-circle-task } |
| **REMOVED:** ~~createDebugFiles~~ |  |  |  |
| **REMOVED:** ~~uglify~~ |  |  |  |
| generateVersionInfo | {: .sap-icon-circle-task-2 } |  |  |
| generateCachebusterInfo | {: .sap-icon-circle-task } |  |  |
| generateApiIndex | {: .sap-icon-circle-task }^1^ |  |  |
| generateResourcesJson | {: .sap-icon-circle-task } | {: .sap-icon-circle-task } | {: .sap-icon-circle-task } |

*Enabled by default*
{: .sap-icon-circle-task-2-before }

*Disabled by default. Can be activated by certain build modes, the project configuration, or by using the `--include-task` [CLI parameter](../pages/CLI.md#ui5-build). See footnotes where given* 
{: .sap-icon-circle-task-before }

---

^1^ Enabled in `jsdoc` build, which disables most of the other tasks  
^2^ Enabled for projects defining a [component preload configuration](../pages/Configuration.md#component-preload-generation)  
^3^ Enabled in `self-contained` build, which disables `generateComponentPreload` and `generateLibraryPreload`  
^4^ Enabled for projects defining a [bundle configuration](../pages/Configuration.md#custom-bundling)  
