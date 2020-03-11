# Configuration
This document describes the configuration of UI5 Tooling based projects and extensions. It represents **[Specification Version](#specification-versions) `1.1`**.

A projects UI5 Tooling configuration is typically located in a [YAML](https://yaml.org/) file named `ui5.yaml`, located in the root directory.

## Example

````yaml
specVersion: "1.1"
type: application|library|theme-library|module
metadata:
  name: some.project.name
````

## General Configuration
A project must define a specification version (`specVersion`), to which its configuration is compatible to. Also see [Specification Versions](#specification-versions).

In addition, a project must define a `type`. This can be either `application`, `library`, `theme-library` (since Specification Version 1.1) or `module`. The type defines the default path mappings and build tasks. See [UI5 Builder: Types](./Builder.md#types) for details.

````yaml
specVersion: "1.1"
type: library
````

### Metadata
A project must have a `name` and might define a `copyright` string.

In the UI5 Tooling, a project is typically identified by the configured `name`. It must be unique and should follow a namespace scheme like `company.businessarea.project`.

A given `copyright` string will be used to fill placeholders like `${copyright}` and `@copyright@` in a projects source code. `|-` is a way to define a multi line string in YAML. For details, please check the [YAML Specification](https://yaml.org/spec/1.2/spec.html#id2794534).  
Inside the copyright string, you can use the placeholder `${currentYear}` which will be replaced with the current year.

In case your project is deprecated you may also define a property `deprecated: true`. In projects that have a direct dependency to your project, the UI5 Tooling will then display a deprecation warning.

````yaml
metadata:
  name: my.cool.project
  copyright: |-
   My Cool Project
    * (c) Copyright 2009-${currentYear} My Company
    * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
````

## Resources
### Path Mapping
Depending on the project type, the UI5 Tooling expects your projects source files to be in certain directories:

**Type: application**  
Default directory for runtime and test files: `webapp`

**Type: library and theme-library**  
Default directory for runtime files: `src`  
Default directory for test files: `test`

**Type: module**  
By default the projects root directory will be used.

---

If your projects sources are located in different directories, you need to configure a path mapping. As types might require unique project structures, this configuration can differ:

Note that all configured paths must be POSIX and relative to the projects root directory.

#### Path Mapping of Applications
Available mappings:

- `webapp` (runtime path `/`)

````yaml
resources:
  configuration:
    paths:
      webapp: my/path
````

#### Path Mapping of Libraries
Available mappings:

- `src` (runtime path `/resources`)
- `test` (runtime path `/test-resources`)

````yaml
resources:
  configuration:
    paths:
      src: path/to/sources
      test: path/to/tests
````

#### Path Mapping of Modules
Any virtual paths can be mapped to any physical path.

However, it is recommended that modules include their namespace in the virtual path and use the `/resources` prefix (e.g. `/resources/my/library/module-xy/`).

````yaml
resources:
  configuration:
    paths:
      "/resources/my/library/module-xy/": lib
      "/resources/my/library/module-xy-min/": dist
````

### Encoding of `*.properties` files
*Available since UI5 CLI [`v1.7.0`](https://github.com/SAP/ui5-cli/releases/tag/v1.7.0)*

By default, the UI5 Tooling expects `*.properties` files to be `ISO-8859-1` encoded. 

If your project uses `UTF-8` encoding for these files (for example because it has been created in SAP WebIDE), you need to set the `propertiesFileSourceEncoding` configuration property.

Your projects `*.properties` files will be read in the given encoding and any non-ASCII characters replaced with the respective unicode escape sequences. This allows you to deploy the resulting files to any environment, independent from how it expects `*.properties` files to be encoded. Please refer to [RFC 7](https://github.com/SAP/ui5-tooling/blob/master/rfcs/0007-properties-file-encoding.md) for details.

````yaml
resources:
  configuration:
    propertiesFileSourceEncoding: UTF-8
````

## Build Configuration
### Build Resources
You can exclude a projects resources from the build process using a list of glob patterns. Matching resources will be ignored by the builder and all build tasks.

Patterns are applied to the **virtual** path of resources (i.e. the UI5 runtime paths). Exclude patterns are always applied after any includes.

````yaml
builder:
  resources:
    excludes:
      - "/resources/some/project/name/test_results/**"
      - "/test-resources/**"
      - "!/test-resources/some/project/name/demo-app/**"
````

### JSDoc
You can exclude a projects resources from the JSDoc build process using a list of glob patterns. Matching resources will be ignored by the JSDoc build task.

Patterns are always applied relative to the projects virtual **source** directory `/resources/`.

Any general builder excludes (as defined in `builder.resources.excludes`) are applied *after* these excludes.

````yaml
builder:
  jsdoc:
    excludes:
      - "some/project/name/thirdparty/**"
````

### Cachebuster
By default, the generated cachebuster info file signatures are based on timestamps (`time`). In setups like CI environments, a mechanism based on file hashes (`hash`) might be more reliable. See also [PR #241](https://github.com/SAP/ui5-builder/pull/241).

````yaml
builder:
  cachebuster:
    signatureType: hash
````

### Custom Tasks

You can define custom build tasks that will be executed for the project. Please refer to the [Custom Tasks Documentation](./extensibility/CustomTasks.md) for a detailed explanation and examples of the build extensibility.

Each `customTasks` entry must define the `name` of the custom task as defined in its `metadata.name` property.

In addition, the execution order needs to be defined by referencing a [standard task](./Builder.md#tasks) or an already configured custom task using the `afterTask` or `beforeTask` property.

Optionally, arbitrary `configuration` can be passed to the custom task.

````yaml
builder:
  customTasks:
    - name: custom-task-1
      beforeTask: replaceCopyright
      configuration:
        some-key: some value
    - name: custom-task-2
      afterTask: custom-task-1
      configuration:
        color: blue
````

## Server Configuration
By default, the UI5 Tooling will serve applications using port `8080`. When running in HTTP/2 or HTTPS mode, port `8443` will be used. If the default port is already in use, the next higher free port will be used.

Instead of this behavior, a project can configure alternative default ports. If the configured port is already in use, an error will be thrown.

The server port can still be overwritten with the CLI parameter `--port`.

````yaml
server:
  settings:
    httpPort: 1337
    httpsPort: 1443
````

## Extension Configuration
Extensions configuration can be added to any projects `ui5.yaml`. It should to be located *after* the projects configuration, separated by [three dashes](https://yaml.org/spec/1.2/spec.html#id2760395) "`---`".

In cases where an extension shall be reused across multiple projects you can make it a module itself and have its configuration in a standalone `ui5.yaml` located inside that module.

Extensions can be identified by the `kind: extension` configuration. Note that if no `kind` configuration is given, [`project`](#project-configuration) is assumed.

### Available Extensions
- [Custom Tasks](./extensibility/CustomTasks.md)
- [Custom Server Middleware](./extensibility/CustomServerMiddleware.md)
- [Project Shims](./extensibility/ProjectShims.md)

### Example
````yaml
specVersion: "1.1"
type: application
metadata:
  name: my.application
---
specVersion: "1.1"
kind: extension
type: project-shim
metadata:
  name: my.application.thirdparty
shims:
  configurations:
    lodash:
      specVersion: "1.1"
      type: module
      metadata:
        name: lodash
      resources:
        configuration:
          paths:
            /resources/my/application/thirdparty/: ""
````


## Custom Bundling

Custom bundles can be defined in the `ui5.yaml`. It should be located in the `builder` configuration. With the property `bundles` a list of `bundleDefinitions` can be described.

````yaml
builder:
  bundles:
    - bundleDefinition:
        name: "sap-ui-custom.js"
        defaultFileTypes:
          - ".js"
        sections:
          - mode: raw
            filters:
            - ui5loader-autoconfig.js
            resolve: true
            sort: true
      bundleOptions:
        optimize: true
    - bundleDefinition:
        name: "app.js"
        defaultFileTypes:
          - ".js"
        sections:
          - mode: preload
            filters:
              - some/app/Component.js
            resolve: true
            sort: true
          - mode: provided
            filters:
            - ui5loader-autoconfig.js
            resolve: true
      bundleOptions:
        optimize: true
````

### Properties

**bundles**

A list of bundle definitions. A `bundleDefinition` contains of the following options:

- `name`: The module bundle name
- `defaultFileTypes`: List of default file types which should be included in the bundle
  - `sections`: A list of module bundle definition sections. Each section specifies an embedding technology (see [API-Reference](https://sap.github.io/ui5-tooling/api/module-@ui5_builder.tasks.html#.generateBundle)) and lists the resources that should be in- or excluded from the section.
    - `mode`:  The embedding technology (e.g. provided, raw, preload)
    - `filters`: List of resources as glob patterns that should be in- or excluded. A pattern either contains of a trailing slash `/` or single `*` and double `**` asterisks which denote an arbitrary number of characters or folder names. Exludes should be marked with a leading exclamation mark '!'. The order of filters is relevant, a later exclusion overrides an earlier inclusion and vice versa.
    - `resolve`: Setting resolve to `true` will also include all (transitive) dependencies of the files
    - `resolveConditional`: Whether conditional dependencies of modules should be resolved and added to the module set for this section. By default set to `false`
    - `renderer`: Whether renderers for controls should be added to the module set. By default set to `false`
    - `sort`:  By default, modules are sorted by their dependencies. The sorting can be suppressed by setting the option to `false`

**bundleOptions**

- `optimize`: By default set to `false`. If set to `true`, the module bundle gets minified
- `decorateBootstrapModule`: By default set to `true`. If set to `false`, the module won't be decorated with an optimization marker
- `addTryCatchRestartWrapper`: By default set to `false`. If set to `true`, bootable module bundles gets wrapped with a try/catch to filter "Restart" errors
- `usePredefineCalls`: If set to `true`, `sap.ui.predefine` is used for UI5 modules
- `numberOfParts`: By default set to `1`. The number of parts into which a module bundle should be splitted

## Specification Versions
A project must define a Specification Version by setting the `specVersion` property. The UI5 Tooling uses this information to detect whether the currently installed version is compatible to a projects configuration.

````yaml
specVersion: "1.1"
[...]
````

To use new features, a project might need to update the `specVersion` property.

For a given Specification Version **MAJOR.MINOR** we will increment:

1. **MAJOR** when there are breaking changes that might require additional actions by the project maintainer
2. **MINOR** when adding new features that are fully backward compatible

All changes are documented below.

### Compatibility Matrix

Unless otherwise noted in the table below, the UI5 Tooling modules are backward compatible in the means that for example UI5 CLI v2.0 will still be able to handle a project that is using Specification Version `1.0`.

Version | UI5 CLI Release
--- | ---
**0.1** | v0.0.1+
**1.0** | v1.0.0+
**1.1** | v1.13.0+

### Specification Version 0.1
Initial version.

Version 0.1 projects are compatible with [UI5 CLI](https://github.com/SAP/ui5-cli) v0.0.1 and above.

### Specification Version 1.0
First stable release.

Version 1.0 projects are supported by [UI5 CLI](https://github.com/SAP/ui5-cli) v1.0.0 and above.

### Specification Version 1.1
Adds support for the `theme-library` type.

Version 1.1 projects are supported by [UI5 CLI](https://github.com/SAP/ui5-cli) v1.13.0 and above.
