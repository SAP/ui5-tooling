# UI5 Builder

[**API Reference**](https://sap.github.io/ui5-tooling/api/module-@ui5_builder.html){: .md-button .sap-icon-initiative }

This module takes care of building your project.

Based on a project's type, the UI5 Builder defines a series of build steps to execute, these are also called "tasks".

For every type there is a set of default tasks. You can disable single tasks using the `--exclude-task` [CLI parameter](./CLI.md#ui5-build) and you can include tasks using the `--include-task` parameter.

## Types
Types define how a project can be configured and how it is built. A type orchestrates a set of tasks and defines the order in which they get applied during build phase. Furthermore, it takes care of formatting and validating the project-specific configuration.

Also see [UI5 Project: Configuration](./Configuration.md#general-configuration)

### application
Projects of type `application` are typically the main or root project. In a projects dependency tree, there should only be one project of type `application`. If multiple are found, those further away from the root are ignored.

The source directory of an application (typically named `webapp`) is mapped to the virtual root path `/`.

An applications source directory may or may not contain a `Component.js` file. If it does, it must also contain a `manifest.json` file. If there is a `Component.js` file, an optimized `Component-preload.js` file will be generated during the build.

### library
UI5 libraries are often referred to as reuse-, custom- or [control libraries](https://github.com/SAP/openui5/blob/master/docs/controllibraries.md). They are a key component in sharing code across multiple projects in UI5.

A project of type `library` must have a source directory (typically named `src`). It may also feature a "test" directory. These directories are mapped to the virtual directories `/resources` for the sources and `/test-resources` for the test resources.

These directories should contain a directory structure representing the namespace of the library (e.g. `src/my/first/library`) to prevent name clashes between the resources of different libraries.

### theme-library
*Available since [Specification Version](./Configuration.md#specification-versions) 1.1*

UI5 theme libraries provide theming resources for the controls of one or multiple libraries.

A project of type `theme-library` must have a source directory (typically named `src`). It may also feature a "test" directory. These directories are mapped to the virtual directories `/resources` for the sources and `/test-resources` for the test resources.

The source directory must contain a directory structure representing the namespaces of the libraries it provides theme resources for. For example, a theme library named `my_custom_theme`, providing resources for a library named `my.library` should have these resources in a directory path `my/library/themes/my_custom_theme/`.

### module
The `module` type is meant for usage with non-UI5 resources like third party libraries. Their path mapping can be configured freely. During a build, their resources are copied without modifications.

## Tasks
Tasks are specific build steps to be executed during build phase.

They are responsible for collecting resources which can be modified by a processor. A task configures one or more processors and supplies them with the collected resources. After the respective processor processed the resources, the task is able to continue with its workflow.

A project can add custom tasks to the build by using the [Custom Tasks Extensibility](./extensibility/CustomTasks.md).

All available standard tasks are documented [in the API reference](https://sap.github.io/ui5-tooling/api/module-@ui5_builder.tasks.html) and listed below in the order of their execution:

| Task | Type `application` | Type `library` | Type `theme-library` |
| ---- | :----: | :----: | :----: |
| escapeNonAsciiCharacters | {: .sap-icon-circle-task-2 } | {: .sap-icon-circle-task-2 } |  |
| replaceCopyright | {: .sap-icon-circle-task-2 } | {: .sap-icon-circle-task-2 } | {: .sap-icon-circle-task-2 } |
| replaceVersion | {: .sap-icon-circle-task-2 } | {: .sap-icon-circle-task-2 } | {: .sap-icon-circle-task-2 } |
| generateJsdoc |  | {: .sap-icon-circle-task }^1^ |  |
| executeJsdocSdkTransformation |  | {: .sap-icon-circle-task }^1^ |  |
| generateFlexChangesBundle |  | {: .sap-icon-circle-task-2 } |  |
| generateManifestBundle | {: .sap-icon-circle-task } | {: .sap-icon-circle-task } |  |
| generateLibraryManifest |  | {: .sap-icon-circle-task-2 } |  |
| generateLibraryPreload |  | {: .sap-icon-circle-task-2 } |  |
| generateComponentPreload | {: .sap-icon-circle-task-2 } | {: .sap-icon-circle-task }^2^ |  |
| generateStandaloneAppBundle | {: .sap-icon-circle-task }^3^ |  |  |
| transformBootstrapHtml | {: .sap-icon-circle-task }^3^ |  |  |
| generateBundle | {: .sap-icon-circle-task }^4^ | {: .sap-icon-circle-task }^4^ |  |
| buildThemes |  | {: .sap-icon-circle-task-2 } | {: .sap-icon-circle-task-2 } |
| createDebugFiles | {: .sap-icon-circle-task-2 } | {: .sap-icon-circle-task-2 } |  |
| uglify | {: .sap-icon-circle-task-2 } | {: .sap-icon-circle-task-2 } |  |
| generateVersionInfo | {: .sap-icon-circle-task-2 } |  |  |
| generateCachebusterInfo | {: .sap-icon-circle-task } |  |  |
| generateApiIndex | {: .sap-icon-circle-task }^1^ |  |  |
| generateResourcesJson | {: .sap-icon-circle-task } | {: .sap-icon-circle-task } | {: .sap-icon-circle-task } |

*Enabled by default*
{: .sap-icon-circle-task-before }

*Disabled by default. Can be activated by certain build modes, project configuration or by using the `--include-task` [CLI parameter](./CLI.md#ui5-build). See footnotes were given* 
{: .sap-icon-circle-task-2-before }

---

^1^ Enabled in `jsdoc` build, which disables most of the other tasks  
^2^ Enabled for projects defining a [component preload configuration](./Configuration.md#component-preload-generation)  
^3^ Enabled in `self-contained` build, which disables `generateComponentPreload` and `generateLibraryPreload`  
^4^ Enabled for projects defining a [bundle configuration](./Configuration.md#custom-bundling)  

## Processors
Processors work with provided resources. They contain the actual build step logic to apply specific modifications to supplied resources, or to make use of the resources' content to create new resources out of that.

Processors can be implemented generically. The string replacer is an example for that.
Since string replacement is a common build step, it can be useful in different contexts, e.g. code, version, date, and copyright replacement. A concrete replacement operation could be achieved by passing a custom configuration to the processor. This way, multiple tasks can make use of the same processor to achieve their build step.

Available processors are listed [in the API reference](https://sap.github.io/ui5-tooling/api/module-@ui5_builder.processors.html).

## Legacy Bundle Tooling (lbt)
JavaScript port of the "legacy" Maven/Java based bundle tooling.
