# UI5 Project

The [UI5 Project](https://github.com/SAP/ui5-project) module provides functionality to build a UI5 project. Also see [Development Overview: Project Dependencies](./Overview.md#project-dependencies).

## Types
Types define how a project can be configured and how it is built. A type orchestrates a set of tasks and defines the order in which they get applied during build phase. Furthermore, it takes care of formatting and validating the project-specific configuration.

Also see [UI5 Project: Configuration](./Configuration.md#general-configuration)

### application
Projects of type `application` are typically the main or root project. In a projects dependency tree, there should only be one project of type `application`. If multiple are found, those further away from the root are ignored.

The source directory of an application (typically named `webapp`) is mapped to the virtual root path `/`.

An applications source directory may or may not contain a `Component.js` file. If it does, it must also contain a `manifest.json` file. If there is a `Component.js` file, an optimized `Component-preload.js` file will be generated during the build.

### library
UI5 libraries are often referred to as reuse-, custom- or [control libraries](https://github.com/SAP/openui5/blob/main/docs/controllibraries.md). They are a key component in sharing code across multiple projects in UI5.

A project of type `library` must have a source directory (typically named `src`). It may also feature a "test" directory. These directories are mapped to the virtual directories `/resources` for the sources and `/test-resources` for the test resources.

These directories should contain a directory structure representing the namespace of the library (e.g. `src/my/first/library`) to prevent name clashes between the resources of different libraries.

### theme-library
*Available since [Specification Version](./Configuration.md#specification-versions) 1.1*

UI5 theme libraries provide theming resources for the controls of one or multiple libraries.

A project of type `theme-library` must have a source directory (typically named `src`). It may also feature a "test" directory. These directories are mapped to the virtual directories `/resources` for the sources and `/test-resources` for the test resources.

The source directory must contain a directory structure representing the namespaces of the libraries it provides theme resources for. For example, a theme library named `my_custom_theme`, providing resources for a library named `my.library` should have these resources in a directory path `my/library/themes/my_custom_theme/`.

### module
The `module` type is meant for usage with non-UI5 resources like third-party libraries. Their path mapping can be configured freely. During a build, their resources are copied without modifications.


## Build Output Style

The Build Output Style offers developers control over their project's build output folder. Namespaces like `sap.m` or `sap.ui.core` can be streamlined, producing a more concise and flat output. For example, a resource like `/resources/sap/m/RangeSlider.js` will be transformed into `./RangeSlider.js`. And vice versa, applications that are built by default with `Flat` output, can leverage the namespaces they have. 

**Note**: Build Output Style is applied only over root project's output folder structure. Any dependencies included in the build would remain with their `Default` output style.

In the table below are the available combinations between project type & build output style.

| Requested Output Style / Project Type | Resulting Style |
|---|---|
| **Default** | |
| `application` | Root project is written `Flat`-style, dependencies in their respective `Default`-style |
| `library` | Root project is written `Namespace`-style, dependencies in their respective `Default`-style |
| `theme-library` | Root project is written in the style of the sources (multiple namespaces), dependencies in their respective `Default`-style |
| `module` | Root project is written with the [configured paths](https://sap.github.io/ui5-tooling/stable/pages/Configuration/#available-path-mappings), dependencies in their respective `Default`-style |
| **Flat** | |
| `application` | Same as `Default` |
| `library` | Root project is written `Flat`-style (without it's namespace, logging warnings for resources outside of it), dependencies in their respective `Default`-style |
| `theme-library` | **Unsupported** since a theme-library almost always has more than one namespace |
| `module` | **Unsupported** since modules have explicit path mappings configured and no namespace concept |
| **Namespace** | |
| `application` | Root project is written `Namespace`-style (resources are prefixed with the project's namespace), dependencies are written in their respective `Default`-style |
| `library` | Same as `Default` |
| `theme-library` | **Unsupported** since a theme-library almost always has more than one namespace |
| `module` | **Unsupported** since modules have explicit path mappings configured and no namespace concept |


[**API Reference**](https://sap.github.io/ui5-tooling/v3/api/@ui5_project_build_ProjectBuilder.html){: .md-button .sap-icon-initiative }
