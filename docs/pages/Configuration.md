# Configuration

A projects UI5 Tooling configuration is typically located in a [YAML](https://yaml.org/) file named `ui5.yaml`, located in the root directory.

!!! info
    This document describes the configuration of UI5 Tooling-based projects and extensions. It represents **[Specification Version 3.0](#specification-versions)**.

## Validation / IDE support

Starting with [Specification Version 2.0](#specification-version-20) the configuration is validated according to a JSON schema.  
The current version of the schema can be found here: https://sap.github.io/ui5-tooling/schema/ui5.yaml.json

The schema is also part of the [JSON Schema Store Catalog](http://schemastore.org/json/) which is used by the [YAML Language Server](https://github.com/redhat-developer/yaml-language-server).  
See the list of [clients](https://github.com/redhat-developer/yaml-language-server/blob/main/README.md#clients) to find extensions for various IDEs and editors.

## Example

```yaml
specVersion: "3.0"
type: application|library|theme-library|module
metadata:
  name: some.project.name
```

## General Configuration
A project must define a specification version (`specVersion`), to which its configuration is compatible to. Also see [Specification Versions](#specification-versions).

In addition, a project must define a `type`. This can be either `application`, `library`, `theme-library` (since Specification Version 1.1) or `module`. The type defines the default path mappings and build tasks. See [UI5 Builder: Types](./Builder.md#types) for details.

!!! example

    === "application"

        ```yaml
        specVersion: "3.0"
        type: application
        ```

    === "library"

        ```yaml
        specVersion: "3.0"
        type: library
        ```

    === "theme-library"

        ```yaml
        specVersion: "3.0"
        type: theme-library
        ```

    === "module"

        ```yaml
        specVersion: "3.0"
        type: module
        ```

### Metadata

!!! example
    ```yaml
    metadata:
      name: my.company.project
      copyright: |-
       My Project
        * (c) Copyright 2009-${currentYear} My Company
        * Licensed under the XYZ License, Version n - see LICENSE.txt.
    ```

#### name

A project must have a `name`.

In UI5 Tooling, a project is typically identified by the configured `name`. It must be unique and should ideally follow a namespace scheme like `organization.product.project` for UI5 projects or `ui5-task-heavy-boulder` for extension-projects.

The `name` property of **projects defining Specification Version 3.0 and higher** must satisfy the following conditions:

* Must be at least 3 characters long
* Must be no longer than 50 characters
* Must contain lowercase characters only
* Must contain alphanumeric characters, dash, underscore and period only
    - Exception: The `@` and `/` characters are allowed at certain positions as
      explained below
* Must start with an alphabetic character or an `@` character
* If it starts with an `@` character, it must contain exactly one
  forward slash `/`
    - This is aligned with the npm concept for package scopes, for example `@org/lib.name`

#### copyright

A given `copyright` string will be used to fill placeholders like `${copyright}` and `@copyright@` in a project's source code. `|-` is a way to define a multi line string in YAML. Check the [YAML Specification](https://yaml.org/spec/1.2/spec.html#id2794534) for details.  
Inside the copyright string, you can use the placeholder `${currentYear}` which will be replaced with the current year.

#### deprecated

In case your project is deprecated you may also define a property `deprecated: true`. In projects that have a direct dependency to your project, UI5 Tooling will then display a deprecation warning.

## Resources
### Path Mapping
Depending on the project type, UI5 Tooling expects your projects source files to be located in certain directories.

If your project's sources are located in different directories, you need to configure the path mapping accordingly. Depending on the type of project, there are several different path mappings available.

Note that all configured paths must be written in POSIX (i.e. using only forward slashes `/` as path segment separators) and relative to the project's root directory.

#### Available Path Mappings

=== "Applications"
    - `webapp`: Mapped to runtime path `/` (root)

    ```yaml title="Default Configuration"
    resources:
      configuration:
        paths:
          webapp: webapp
    ```

=== "Libraries"
    - `src`: Mapped to runtime path `/resources`
    - `test`: Mapped to runtime path `/test-resources`

    ```yaml title="Default Configuration"
    resources:
      configuration:
        paths:
          src: src
          test: test
    ```

=== "Modules"
    Modules can map any virtual paths to any physical path within the project.

    However, it is recommended that modules include their namespace in the virtual path and use the `/resources` prefix (e.g. `/resources/my/library/module-xy/`) to avoid name clashes with other projects.

    ```yaml title="Example Configuration"
    resources:
      configuration:
        paths:
          /resources/my/library/module-xy/: lib
          /resources/my/library/module-xy-min/: dist
    ```

!!! example
    For an application project with the following directory structure, you need the path mapping configuration given below:

    ``` hl_lines="3 4 5" title="Directory Structure"
    my-app/
    \_ ui5.yaml
    \_ lib/
      \_ js/
        \_ app/
    ```

    ```yaml hl_lines="4" title="Path Mapping Configuration"
    resources:
      configuration:
        paths:
          webapp: lib/js/app
    ```


### Encoding of `*.properties` files

!!! info
    This configuration is available since UI5 CLI [`v1.7.0`](https://github.com/SAP/ui5-cli/releases/tag/v1.7.0)

!!! example
    === "UTF-8"

        ```yaml
        resources:
          configuration:
            propertiesFileSourceEncoding: UTF-8
        ```

    === "ISO-8859-1"

        ```yaml
        resources:
          configuration:
            propertiesFileSourceEncoding: ISO-8859-1
        ```

By default UI5 Tooling expects different encodings for `*.properties` i18n files, depending on the project's specification version:

Specification Version | Default `propertiesFileSourceEncoding`
--- | ---
**2.0+** | `UTF-8`
**0.1, 1.0 or 1.1** | `ISO-8859-1`

If your project uses a different encoding for `*.properties` files, you need to set the `propertiesFileSourceEncoding` configuration property.

UI5 Tooling will read the corresponding files of the project in the given encoding. Any non-ASCII characters will be replaced with the respective Unicode escape sequences. This allows you to deploy the resulting files to any environment, independent of how it expects `*.properties` files to be encoded. Please refer to [RFC 7](https://github.com/SAP/ui5-tooling/blob/main/rfcs/0007-properties-file-encoding.md) for details.

## Custom Configuration

!!! info
    This configuration is available since UI5 CLI [`v2.2.0`](https://github.com/SAP/ui5-cli/releases/tag/v2.2.0)
    and applies only to projects defining [Specification Version](#specification-versions)
    2.1 or higher.

!!! example
    ```yaml
    customConfiguration:
      myTool:
        key: value
      myOtherTool:
        otherKey: otherValue
    ```

Custom configuration that is ignored by UI5 Tooling.  
This can be used to store UI5 specific configuration for third-party tools.

The "customConfiguration" value must be an object.  
For third-party tools it is recommended to follow a namespace-like structure.

## Framework Configuration

!!! info
    This configuration is available since UI5 CLI [`v2.0.0`](https://github.com/SAP/ui5-cli/releases/tag/v2.0.0)
    and applies only to projects defining [Specification Version](#specification-versions)
    2.0 or higher.

Define your project's framework dependencies.

### Framework and Version

In your project's framework configuration you must define whether you want to use the OpenUI5 or the SAPUI5 framework and which version:

=== "OpenUI5"
    ```yaml
    framework:
      name: OpenUI5
      version: 1.82.0
    ```

=== "SAPUI5"
    ```yaml
    framework:
      name: SAPUI5
      version: 1.82.0
    ```

If you are not sure which framework is right for you, see our [documentation on the differences between OpenUI5 and SAPUI5](./FAQ.md##whats-the-difference-between-openui5-and-sapui5).

You can find an overview of the available versions for each framework here:

- [**OpenUI5** Version Overview](https://openui5.hana.ondemand.com/versionoverview.html)
    - *The lowest version supported by UI5 Tooling is __1.52.5__*
- [**SAPUI5** Version Overview](http://ui5.sap.com/versionoverview.html)
    - *The lowest version supported by UI5 Tooling is __1.76.0__*

!!! info
    Projects that use the OpenUI5 framework cannot depend on projects that use the SAPUI5 framework.

### Dependencies

!!! example
    === "application"
        ```yaml
        specVersion: "3.0"
        type: application
        metadata:
          name: my.company.app
        framework:
          name: OpenUI5
          version: 1.82.0
          libraries:
            - name: sap.ui.core
            - name: sap.m
            - name: sap.ui.table
            - name: themelib_sap_fiori_3
        ```

    === "library"
        ```yaml
        specVersion: "3.0"
        type: library
        metadata:
          name: my.company.library
        framework:
          name: SAPUI5
          version: 1.82.0
          libraries:
            - name: sap.ui.core
            - name: sap.m
            - name: themelib_sap_belize
              optional: true
            - name: themelib_sap_bluecrystal
              optional: true
            - name: themelib_sap_fiori_3
              optional: true
        ```

        When building an application depending on this library as well as one of the theme libraries, only that theme is built for this library.

#### Runtime Dependencies

All libraries required by your project must be listed in the `libraries` section of the framework configuration:

=== "OpenUI5"
    ```yaml hl_lines="4-7"
    framework:
      name: OpenUI5
      version: 1.82.0
      libraries:
        - name: sap.ui.core
        - name: sap.m
        - name: sap.ui.table
    ```

=== "SAPUI5"
    ```yaml hl_lines="4-7"
    framework:
      name: SAPUI5
      version: 1.82.0
      libraries:
        - name: sap.ui.core
        - name: sap.m
        - name: sap.ui.comp
    ```

#### Development Dependencies
Development dependencies are only installed if the project defining them is the current root project.
They are typically only required during the development of the project.

```yaml hl_lines="3"
  libraries:
    - name: sap.ushell
      development: true
```

Note that a development dependency cannot be optional and vice versa.

#### Optional Dependencies
Optional dependencies are installed either if the project defining them is the current root project or if the dependency is already part of the current dependency tree. A typical use case is libraries defining optional dependencies to all theme libraries they support.
You can choose which theme library to use by the application that is consuming the library by declaring it as a non-optional dependency.

```yaml hl_lines="3"
  libraries:
    - name: themelib_sap_fiori_3
      optional: true
```

## Build Configuration
### Exclude Resources

!!! example
    ```yaml
    builder:
      resources:
        excludes:
          - "/resources/some/project/name/test_results/**"
          - "/test-resources/**"
          - "!/test-resources/some/project/name/demo-app/**"
    ```

You can exclude a projects resources from the build process using a list of glob patterns. Matching resources will be ignored by the builder and all build tasks.

Patterns are applied to the **virtual** path of resources (i.e. the UI5 runtime paths). Exclude patterns are always applied after any includes.

### Cachebuster

!!! example
    === "time (default)"
        ```yaml
        builder:
          cachebuster:
            signatureType: time
        ```
    === "hash"
        ```yaml
        builder:
          cachebuster:
            signatureType: hash
        ```

By default, the generated cachebuster info file signatures are based on timestamps (`time`). In setups like CI environments, a mechanism based on file hashes (`hash`) might be more reliable. Also see [PR #241](https://github.com/SAP/ui5-builder/pull/241) for more details.

### Component Preload Generation

For projects of type `application` a `Component-preload.js` bundle is generated by default. This bundle will contain most UI5 runtime-relevant resources of the component.  
You can override this default behavior by defining a `componentPreload` configuration.

For projects of type `library`, no Component Preload is created by default.  
However you can define a `componentPreload` configuration to create Component Preload bundles. Those will be created in addition to the `library-preload.js` bundle.

There are two ways to define the set of components for which preload bundles should be generated. You can either provide `paths` (allowing patterns) or `namespaces`. You can also combine both configuration options. Defining any of them overrides the default preload bundle generation for the root component of `application` projects.

#### paths

!!! example
    ```yaml
    builder:
      componentPreload:
        paths:
            - "my/awesome/app/**/Component.js"
    ```

The `paths` option takes one or multiple patterns. For every matched file a separate `Component-preload.js` will be generated. Patterns are always applied relative to the project's virtual source directory `/resources/`.

#### namespaces

!!! example
    ```yaml
    builder:
      componentPreload:
        namespaces:
          - "my/awesome/app"
          - "my/awesome/app/componentOne"
          - "my/awesome/app/componentTwo"
    ```

The `namespaces` option takes one or multiple component namespaces, which correspond to the directory structures.

#### excludes

!!! info
    This configuration is available since UI5 CLI [`v2.10.0`](https://github.com/SAP/ui5-cli/releases/tag/v2.10.0)
    and applies only to projects defining [Specification Version](#specification-versions)
    2.3 or higher.

!!! example
    === "Single Component"

        ```yaml
        builder:
          componentPreload:
            excludes:
              - "my/awesome/app/localService/**"
        ```

    === "Multiple Components"

        ```yaml
        builder:
          componentPreload:
            namespaces:
              - "my/awesome/app"
              - "my/awesome/app/componentOne"
              - "my/awesome/app/componentTwo"
            excludes:
              - "my/awesome/app/**/thirdparty/"
              - "!my/awesome/app/componentTwo/thirdparty/NotExcluded.js"
        ```

List of modules declared as glob patterns (resource name patterns) that are excluded from the component preload bundles. Similarly to the use of a single `*` or double `**` asterisk, a pattern ending with a slash `/` denotes an arbitrary number of characters or folder names. Re-includes have to be marked with a leading exclamation mark `!`. The order of filters is relevant; a later inclusion overrides an earlier exclusion, and vice versa.

Note that patterns are always applied relative to the project's virtual source directory `/resources/`. Re-includes must start with the namespace of the component they apply to.

### Library Preload Generation

For projects of type `library` a `library-preload.js` bundle is generated by default. This bundle will contain most UI5 runtime-relevant resources of the library.

#### excludes

!!! info
    This configuration is available since UI5 CLI [`v2.10.0`](https://github.com/SAP/ui5-cli/releases/tag/v2.10.0)
    and applies only to projects defining [Specification Version](#specification-versions)
    2.3 or higher.

!!! example
    ```yaml
    builder:
      libraryPreload:
        excludes:
          - "my/lib/thirdparty/"
          - "!my/lib/thirdparty/NotExcluded.js"
    ```
List of modules declared as glob patterns (resource name patterns) that are excluded from `library-preload.js` bundle. Similarly to the use of a single `*` or double `**` asterisk, a pattern ending with a slash `/` denotes an arbitrary number of characters or folder names. Re-includes have to be marked with a leading exclamation mark `!`. The order of filters is relevant; a later inclusion overrides an earlier exclusion, and vice versa.

Note that patterns are always applied relative to the project's virtual source directory `/resources/`. Re-includes must start with the library's namespace.

### Custom Tasks

!!! example
    ```yaml
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
    ```

You can define custom build tasks that will be executed for the project. Please refer to the [Custom Tasks Documentation](./extensibility/CustomTasks.md) for a detailed explanation and examples of the build extensibility.

Each `customTasks` entry must define the `name` of the custom task as defined in its `metadata.name` property.

In addition, the execution order needs to be defined by referencing a [standard task](./Builder.md#tasks) or an already configured custom task using the `afterTask` or `beforeTask` property.

Optionally, arbitrary `configuration` can be passed to the custom task.

### JSDoc

!!! example
    ```yaml
    builder:
      jsdoc:
        excludes:
          - "some/project/name/thirdparty/**"
    ```

You can exclude the resources of a project from the JSDoc build process using a list of glob patterns. Matching resources will be ignored by the JSDoc build task.

Patterns are always applied relative to the project's virtual **source** directory `/resources/`.

These excludes are applied *before* any general builder excludes that have been defined in `builder.resources.excludes`.

### Include Dependencies

!!! info
    This configuration is available since UI5 CLI [`v2.12.0`](https://github.com/SAP/ui5-cli/releases/tag/v2.12.0)
    and applies only to projects defining [Specification Version](#specification-versions)
    2.5 or higher.

!!! example
    ```yaml
    builder:
      settings:
        includeDependency:
          - shimmed.thirdparty.library
        includeDependencyRegExp:
          - ^com\.namespace
        includeDependencyTree:
          - sap.m
    ```

You can include certain dependencies into the build process using the `includeDependency` builder setting. By using `includeDependencyRegExp`, a regular expression can be used, for example to specify a namespace to dynamically select a group of dependencies that have to be included into the build result. By using `includeDependencyTree`, a selected dependency including all of its sub-dependencies is used.

This configuration can be overwritten more precisely with the CLI parameters `--include-dependency`, `--include-dependency-regexp`, `--include-dependency-tree`, `--exclude-dependency`, `--exclude-dependency-regexp` and `--exclude-dependency-tree`.

### Minification

For projects of type `application` and `library` the minification is done for all JavaScript files. This minification includes by default the [standard build tasks](./Builder.md#tasks) `uglify` and `createDebugFiles`.

#### excludes

!!! info
    This configuration is available since UI5 CLI [`v2.14.0`](https://github.com/SAP/ui5-cli/releases/tag/v2.14.0)
    and applies only to projects defining [Specification Version](#specification-versions)
    2.6 or higher.

!!! example
    ```yaml
    builder:
      minification:
        excludes:
          - "my/lib/thirdparty/"
          - "!my/lib/thirdparty/NotExcluded.js"
    ```

List of modules declared as glob patterns (resource name patterns) that are excluded from resource minification. Re-includes have to be marked with a leading exclamation mark `!`. The order of filters is relevant; a later inclusion overrides an earlier exclusion, and vice versa.

Note that patterns are always applied relative to the project's virtual source directory `/resources/`.


## Server Configuration

!!! example
    ```yaml
    server:
      settings:
        httpPort: 1337
        httpsPort: 1443
    ```

By default, UI5 Tooling will serve applications using Port `8080`. When running in HTTP/2 or HTTPS mode, Port `8443` will be used.

If the default port is already in use, the next highest free port will be used.

A project can also configure alternative default ports. If the configured port is already in use, an error will be thrown.

The default and configured server ports can always be overwritten with the CLI parameter `--port`.

## Extension Configuration

!!! example
    ```yaml
    specVersion: "3.0"
    type: application
    metadata:
      name: my.application
    ---
    specVersion: "3.0"
    kind: extension
    type: project-shim
    metadata:
      name: my.application.thirdparty
    shims:
      configurations:
        lodash:
          specVersion: "3.0"
          type: module
          metadata:
            name: lodash
          resources:
            configuration:
              paths:
                /resources/my/application/thirdparty/: ""
    ```

Extensions configuration can be added to any projects `ui5.yaml`. For better readability, it should to be located *after* the projects configuration, separated by [three dashes](https://yaml.org/spec/1.2/spec.html#id2760395) "`---`".

In cases where an extension shall be reused across multiple projects you can make it a module itself and have its configuration in a standalone `ui5.yaml` located inside that module.

Extensions can be identified by the `kind: extension` configuration. Note that if no `kind` configuration is given, [`project`](#project-configuration) is assumed.

### Available Extensions
- [Custom Tasks](./extensibility/CustomTasks.md)
- [Custom Server Middleware](./extensibility/CustomServerMiddleware.md)
- [Project Shims](./extensibility/ProjectShims.md)

## Custom Bundling

!!! example
    ```yaml
    builder:
      bundles:
        - bundleDefinition:
            name: "sap-ui-custom.js"
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
    ```

Custom bundles can be defined in the `ui5.yaml`. Within the `builder/bundles` configuration a list of `bundleDefinitions` can be described.

### Properties

**bundles**

A list of bundle definitions. A `bundleDefinition` contains of the following options:

- `name`: The module bundle name
- `defaultFileTypes`: List of default file types which should be included in the bundle. Defaults to: `.js`, `.control.xml`, `.fragment.html`, `.fragment.json`, `.fragment.xml`, `.view.html`, `.view.json` and `.view.xml`
  - `sections`: A list of module bundle definition sections. Each section specifies an embedding technology (see [API-Reference](https://sap.github.io/ui5-tooling/v3/api/module-@ui5_builder_tasks_bundlers_generateBundle.html)) and lists the resources that should be in- or excluded from the section.
    - `mode`:  The embedding technology (e.g. provided, raw, preload)
    - `filters`: List of modules declared as glob patterns (resource name patterns) that are in- or excluded. Similarly to the use of a single `*` or double `**` asterisk, a pattern ending with a slash `/` denotes an arbitrary number of characters or folder names. Excludes have to be marked with a leading exclamation mark `!`. The order of filters is relevant; a later inclusion overrides an earlier exclusion, and vice versa.
    - `resolve`: Setting resolve to `true` will also include all (transitive) dependencies of the files
    - `resolveConditional`: Whether conditional dependencies of modules should be resolved and added to the module set for this section. By default set to `false`
    - `declareRawModules`: Whether raw modules should be declared after jQuery.sap.global became available. With the usage of the ui5loader, this flag should be set to 'false'. By default set to `false`
    - `renderer`: Whether renderers for controls should be added to the module set. By default set to `false`
    - `sort`:  By default, modules are sorted by their dependencies. The sorting can be suppressed by setting the option to `false`

**bundleOptions**

- `optimize`: If set to `true`, the module bundle gets minified.
  - Since UI5 Tooling `v3.0.0` defaults to `true`. 
  - Prior to UI5 Tooling `v3.0.0` defaults to `false`.
- `decorateBootstrapModule`: By default set to `false`. If set to `true`, the module will be decorated with an optimization marker
- `addTryCatchRestartWrapper`: By default set to `false`. If set to `true`, bootable module bundles gets wrapped with a try/catch to filter "Restart" errors
- `usePredefineCalls`: If set to `true`, `sap.ui.predefine` is used for UI5 modules
- `numberOfParts`: By default set to `1`. The number of parts into which a module bundle should be splitted
- `sourceMap`: By default set to `true`. Adds source map support to the bundle. Available since UI5 Tooling `v3.0.0`

## Specification Versions
A project must define a Specification Version by setting the `specVersion` property. UI5 Tooling uses this information to detect whether the currently installed version is compatible to a project's configuration.

```yaml
specVersion: "3.0"
[...]
```

To use new features, a project might need to update the `specVersion` property.

For a given Specification Version **MAJOR.MINOR** we will increment:

1. **MAJOR** when there are breaking changes that might require additional actions by the project maintainer
2. **MINOR** when adding new features that are fully backward compatible

All changes are documented below.

### Compatibility Matrix

Unless otherwise noted in the table below, UI5 Tooling modules are backward compatible.

Version | UI5 CLI Release
--- | ---
**3.0** | v3.0.0+
**2.6** | v2.14.0+
**2.5** | v2.12.0+
**2.4** | v2.11.0+
**2.3** | v2.10.0+
**2.2** | v2.4.0+
**2.1** | v2.2.0+
**2.0** | v2.0.0+
**1.1** | v1.13.0+
**1.0** | v1.0.0+
**0.1** | v0.0.1+

### Specification Version 3.0 [beta]

!!! info
    **Note:** UI5 Tooling version 3.0 is currently in development. If you wish to migrate to the latest UI5 Tooling, check the [Upgrade Guide for v3](../../updates/migrate-v3/)

**Breaking changes:**

[bundleOptions](#custom-bundling) has been modified:

- `debugMode` has been removed
- `optimize` now always defaults to `true` [#685](https://github.com/SAP/ui5-builder/pull/685)

**Features:**

- Adds support for `sourceMap` configuration for the application and library [bundleOptions](#properties)

Specification Version 3.0 projects are supported by [UI5 CLI](https://github.com/SAP/ui5-cli) v3.0.0 and above.

### Specification Version 2.6
**Features:**

- Adds support for `excludes` configuration for the application and library [minification](#excludes_2)

Specification Version 2.6 projects are supported by [UI5 CLI](https://github.com/SAP/ui5-cli) v2.14.0 and above.

### Specification Version 2.5
**Features:**

- Adds support for the build configuration [`includeDependency`](#include-dependencies)
- Allows [server configuration](#server-configuration) in projects of type `module`

Specification Version 2.5 projects are supported by [UI5 CLI](https://github.com/SAP/ui5-cli) v2.12.0 and above.

### Specification Version 2.4
**Features:**

- Adds support for `bundleInfo` mode in bundle definitions.

Specification Version 2.4 projects are supported by [UI5 CLI](https://github.com/SAP/ui5-cli) v2.11.0 and above.

### Specification Version 2.3

**Features:**

- Adds support for `excludes` configuration of [component](#excludes)- and [library](#excludes_1) preload bundles

Specification Version 2.3 projects are supported by [UI5 CLI](https://github.com/SAP/ui5-cli) v2.10.0 and above.

### Specification Version 2.2

**Features:**

- Custom task extensions can make use of the [`TaskUtil` Helper Class](./extensibility/CustomTasks.md#helper-class-taskutil)

Specification Version 2.2 projects are supported by [UI5 CLI](https://github.com/SAP/ui5-cli) v2.4.0 and above.

### Specification Version 2.1

**Features:**

- Adds support for the ["customConfiguration"](#custom-configuration) configuration
- Custom middleware extensions can make use of the [`MiddlewareUtil` Helper Class](./extensibility/CustomServerMiddleware.md#helper-class-middlewareutil)

Specification Version 2.1 projects are supported by [UI5 CLI](https://github.com/SAP/ui5-cli) v2.2.0 and above.

### Specification Version 2.0

**Breaking changes:**

- Adds and enforces schema validation of the ui5.yaml
- By default the encoding of `*.properties` files is expected to be `UTF-8` (as opposed to `ISO-8859-1` in projects defining specification versions below 2.0)
    - A project can still explicitly configure the [encoding of its `*.properties` files](#encoding-of-properties-files)

**Features:**

- Adds support for the ["framework"](#framework-configuration) configuration to consume SAPUI5 libraries.

Specification Version 2.0 projects are supported by [UI5 CLI](https://github.com/SAP/ui5-cli) v2.0.0 and above.

### Specification Version 1.1

**Features:**

- Adds support for the `theme-library` type.

Specification Version 1.1 projects are supported by [UI5 CLI](https://github.com/SAP/ui5-cli) v1.13.0 and above.

### Specification Version 1.0
First stable release.

Specification Version 1.0 projects are supported by [UI5 CLI](https://github.com/SAP/ui5-cli) v1.0.0 and above.

### Specification Version 0.1
Initial version.

Specification Version 0.1 projects are compatible with [UI5 CLI](https://github.com/SAP/ui5-cli) v0.0.1 and above.
