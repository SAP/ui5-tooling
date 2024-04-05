# Migrate to v4

!!! tip "In Development"
	**UI5 Tooling V4 is still in development 🚧**

	Please use UI5 Tooling V3 by installing the latest version via: `npm i --save-dev @ui5/cli@latest`

	And find the announcement blog post here: **[SAP Community: UI5 Tooling 3.0](https://blogs.sap.com/2023/02/10/ui5-tooling-3.0/)**

## Node.js and npm Version Support

To be defined

## Specification Versions Support

To be defined

## Changes for Projects

To be defined

### Migrate Your Code

To be defined

## Changes to @ui5/cli

To be defined

## Update of Standard Tasks and Processors

To be defined

**Updated list of standard tasks:**

| Task                           | Type `application` | Type `library` | Type `theme-library` |
| ------------------------------ | :----------------: | :------------: | :------------------: |
| escapeNonAsciiCharacters       | *enabled*          | *enabled*      |                      |
| replaceCopyright               | *enabled*          | *enabled*      | *enabled*            |
| replaceVersion                 | *enabled*          | *enabled*      | *enabled*            |
| replaceBuildtime               |                    | *enabled*      |                      |
| generateJsdoc                  |                    | *disabled* ^1^ |                      |
| executeJsdocSdkTransformation  |                    | *disabled* ^1^ |                      |
| minify                         | *enabled*          | *enabled*      |                      |
| generateFlexChangesBundle      | *enabled*          | *enabled*      |                      |
| generateLibraryManifest        |                    | *enabled*      |                      |
| generateComponentPreload       | *enabled*          | *disabled* ^2^ |                      |
| generateLibraryPreload         |                    | *enabled*      |                      |
| generateStandaloneAppBundle    | *disabled* ^3^     |                |                      |
| transformBootstrapHtml         | *disabled* ^3^     |                |                      |
| generateBundle                 | *disabled* ^4^     | *disabled* ^4^ |                      |
| buildThemes                    |                    | *enabled*      | *enabled*            |
| generateThemeDesignerResources |                    | *disabled* ^5^ | *disabled* ^5^       |
| generateVersionInfo            | *disabled*         |                |                      |
| generateCachebusterInfo        | *disabled*         |                |                      |
| generateApiIndex               | *disabled* ^1^     |                |                      |
| generateResourcesJson          | *disabled*         | *disabled*     | *disabled*           |

*Disabled tasks can be activated by certain build modes, the project configuration, or by using the `--include-task` [CLI parameter](../pages/CLI.md#ui5-build). See footnotes where given* 

---

^1^ Enabled in `jsdoc` build, which disables most of the other tasks  
^2^ Enabled for projects defining a [component preload configuration](../pages/Configuration.md#component-preload-generation)  
^3^ Enabled in `self-contained` build, which disables `generateComponentPreload` and `generateLibraryPreload`  
^4^ Enabled for projects defining a [bundle configuration](../pages/Configuration.md#custom-bundling)  
^5^ Can be enabled for framework projects via the `includeTask` option. For other projects, this task is skipped
