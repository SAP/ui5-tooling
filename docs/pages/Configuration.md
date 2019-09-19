# Configuration
This document describes the configuration of UI5 Tooling based projects and extensions.  

The content represents the **[Specification Version](#specification-versions) `1.0`**.

## Contents
- [Project Configuration](#project-configuration)
- [Extension Configuration](#extension-configuration)
    + [Tasks](#tasks)
    + [Project Shims](#project-shims)
- [Specification Versions](#specification-versions)

## Project Configuration
Typically located in a `ui5.yaml` file per project.

The preferred way of storing the configuration of a UI5 Tooling based project is a [YAML](https://yaml.org/) file named `ui5.yaml` inside that project.

**Example**
````yaml
specVersion: "1.0"
type: application
metadata:
  name: my-application
````

Configuration can also be supplied by other means. In cases where JSON is used, you can still rely on the structure described below.

### Structure

````yaml
specVersion: "1.0"
type: application|library|module
metadata:
  name: some.project.name
  copyright: |-
   <project name>
    * (c) Copyright 2009-${currentYear} <my company> <my license>
resources:
  configuration:
    paths:
      "<virtual path 1>": "<physical path 1>"
      "<virtual path 2>": "<physical path 2>"
builder:
  customTasks:
    - name: custom-task-name-1
      beforeTask: standard-task-name
      configuration:
        configuration-key: value
    - name: custom-task-name-2
      afterTask: custom-task-name-1
      configuration:
        color: blue
  resources:
    excludes:
      - "/resources/some/project/name/test_results/**"
      - "/test-resources/**"
      - "!/test-resources/some/project/name/demo-app/**"
  jsdoc:
    excludes:
      - "some/project/name/thirdparty/**"
  cachebuster:
    signatureType: time
server:
  settings:
    httpPort: 1337
    httpsPort: 1443
````

### Properties
#### \<root\>
- `specVersion`: Version of the specification this configuration is based on. See [Specification Versions](#specification-versions)
- `type`: Either `application`, `library` or `module`. Defines the default path mappings and build steps. See [UI5 Builder: Types](https://github.com/SAP/ui5-builder#types) for details

#### metadata
Some general information:
- `name`: Name of the project
- `copyright` (optional): String to be used for replacement of copyright placeholders in the project

#### resources (optional)
- `configuration`
    - `paths`: Mapping between virtual paths and physical paths. Physical paths are always relative to the projects root directory
        + `webapp: webapp`: This path will be mapped to the virtual path `/`.  
          *(Only available for projects of type `application`)*
        + `src: src`: This path will be mapped to the virtual path `/resources`.  
          *(Only available for projects of type `library`)*
        + `test: test`: This path will be mapped to the virtual path `/test-resources`.  
          *(Only available for projects of type `library`)*
        + `<virtual path>: <physical path>` (default `/: ./`): Any virtual path mapping can be defined here.  
          *(Only available for projects of type `module`)*  
          It is recommended that modules include their namespace in the virtual path and use the `/resources` prefix (e.g. `/resources/my/first/library/module-xy`).
    - `propertiesFileSourceEncoding` (since UI5 CLI [`v1.7.0`](https://github.com/SAP/ui5-cli/releases/tag/v1.7.0)):  
Either `ISO-8859-1` (default) or `UTF-8`.  
This option specifies the source encoding of `*.properties` files of the project. Those files will be read in the given encoding and any non-ASCII characters replaced with the respective unicode escape sequences.  
*Also see [RFC 7](https://github.com/SAP/ui5-tooling/blob/master/rfcs/0007-properties-file-encoding.md).*

#### builder (optional)
- `resources`: General resource configuration for this project
    - `excludes`: List of glob patterns. Matching resources of this project will be ignored by the builder (i.e. all tasks).  
    Patterns are applied to the **virtual** path of resources (i.e. the UI5 runtime paths). Exclude patterns are always applied after any includes.
- `jsdoc`: Configuration specific to the JSDoc build task
    - `excludes`: List of glob patterns. Matching resources will be ignored by the JSDoc build task.  
    Patterns are always applied relative to the projects virtual **source** directory `/resources/`.
    Any general builder excludes (as defined in `builder.resources.excludes`) are applied *after* these excludes.
- `customTasks` (optional, list): In this block, you define additional custom build tasks, see [here](./extensibility/CustomTasks.md) for a detailed explanation and examples of the build extensibility. Each entry in the `customTasks` list consists of the following options:
    - `name` (mandatory): The name of the custom task
    - `afterTask` or `beforeTask` (only one, mandatory): The name of the build task after or before which your custom task will be executed.
    - `configuration` (optional): Additional configuration that is passed to the custom build task
- `cachebuster`:
    - `signatureType`: `time` or `hash`. By default, the generated cachebuster info file signatures are based on timestamps (`time`). In setups like CI environments, a mechanism based on file hashes (`hash`) might be more reliable.

#### server (optional)
- `settings`: Overwrite CLI defaults for this project
    - `httpPort`: HTTP server port to use. Can be overwritten via CLI parameter `--port`
    - `httpsPort`: HTTPS server port to use. Can be overwritten via CLI parameter `--port`

## Extension Configuration
Extensions configuration can be added to any projects `ui5.yaml`. It should to be located *after* the projects configuration, separated by [three dashes](https://yaml.org/spec/1.2/spec.html#id2760395).

In cases where an extension shall be reused across multiple projects you can make it a module itself and have its configuration in a standalone `ui5.yaml` located inside that module.

Extensions can be identified by the `kind: extension` configuration. If no `kind` configuration is given, [`project`](#project-configuration) is assumed.

### Available Extensions
- [Custom Tasks](./extensibility/CustomTasks.md)
- [Custom Server Middleware](./extensibility/CustomServerMiddleware.md)
- [Project Shims](./extensibility/ProjectShims.md)

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
    - `filters`: List of resources as glob patterns that should be in- or excluded. A pattern either contains of a trailing slash '/' or single '*' and double '**' asterisks which denote an arbitrary number of characters or folder names. Exludes should be marked with a leading exclamation mark '!'. The order of filters is relevant, a later exclusion overrides an earlier inclusion and vice versa.
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
The specification version as configured in the `specVersion` property, defines the version a configuration is based on.

### Compatibility Matrix

Version | [UI5 CLI](https://github.com/SAP/ui5-cli) Release
--- | ---
**0.1** | v0.0.1+
**1.0** | v1.0.0+

### Specification Version 0.1
Initial version.

Version 0.1 projects are compatible with [UI5 CLI](https://github.com/SAP/ui5-cli) v0.0.1 and above.

### Specification Version 1.0
First stable release.

Version 1.0 projects are supported by [UI5 CLI](https://github.com/SAP/ui5-cli) v1.0.0 and above.
