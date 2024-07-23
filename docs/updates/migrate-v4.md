# Migrate to v4

!!! tip "In Development"
    **UI5 Tooling 4.0 has been released on July 23, 2024 🎉**

    Install the latest version in your projects via: `npm i --save-dev @ui5/cli@latest`  
    And update your global install via `npm i --global @ui5/cli@latest`

    Find the announcement blog post here: **[SAP Community: UI5 Tooling 4.0](https://blogs.sap.com/)**

## UI5 2.x Compatibility

*Also see the blog post [SAP Community: Introducing OpenUI5 2.x](https://community.sap.com/t5/open-source-blogs/introducing-openui5-2-x/ba-p/13580633)*

UI5 Tooling 4.0 is required for building UI5 2.x projects. The UI5 2.x framework libraries define Specification Version 4.0 and therefore can't be built using older UI5 Tooling versions.

For applications and libraries running with UI5 2.x, the use of Specification Version 4.0 is not enforced. It is highly recommended, however, since only then UI5 Tooling will ensure UI5 2.x compatibility of the generated bundles.

## Node.js and npm Version Support

This release requires **Node.js versions v20.11.0, v22.0.0 or higher** as well as npm v8 or higher.
Support for older Node.js releases has been dropped; their use will cause an error.

## Specification Versions Support

As before, only projects with Specification Versions 2.0 and higher are supported.

If a legacy specification version is detected, an automatic migration is attempted.
Your old projects might therefore still work unless they have a non-standard configuration in their ui5.yaml.

## Changes for Projects

!!! success "No changes for Specification Versions 2.x and 3.x"
    Projects defining **Specification Version 2.x or 3.x** are expected to be **fully compatible with UI5 Tooling v4**

    The following does not apply to them.

For projects defining the latest **Specification Version 4.0 or higher**, the following changes apply:

* **Breaking Change:** Bundling of JavaScript modules as a string (in case they require "top level scope") is disabled. 
    
    In UI5 2.x, the feature of evaluating modules from a string is expected to be removed. Therefore, UI5 Tooling will log an error message instead and omit the affected module from the bundle.

    For more details, see [JavaScript Files Requiring Top Level Scope](../pages/Builder.md#javascript-files-requiring-top-level-scope).

* **Breaking Change:** Removal of the `usePredefineCalls` [bundle option](../pages/Configuration.md#properties). UI5 Tooling v4 will _always_ use `sap.ui.predefine` calls in bundles, making this option obsolete. We do not expect any negative impact on application behavior due to this change.

* **Breaking Change:** New `async` option for the `bundleDefinition` section-configuration where the section mode equals `require`. This option defaults to `true` for Specification Version 4.0 and higher, which can influence the loading behavior of your project. Note that the same default is used for all standard bundles, like the component- or library preloads as well as self-contained bundles. See [Configuration: `bundleDefinition.sections`](../pages/Configuration.md#properties) for details.

See also [Configuration: Specification Version 4.0](../pages/Configuration.md#specification-version-40).

## Migrate Your Code

When using the Node.js API of UI5 Tooling, or when integrating it into other tools, the following changes might be relevant to you:

### Changes to @ui5/cli

Occurrences of `console.log` in the code base are replaced with `process.stderr`.
Аny scripts that capture the output from `console.log` need to be adjusted to rely on `process.stderr`.

### Changes to @ui5/fs

Non-public `DuplexCollection#byGlobSource` API has been removed.

### Changes to @ui5/builder

- **Bundling**: The `usePredefineCalls` option has been removed. Bundling now enforces the use of `sap.ui.predefine` instead of function wrappers.  

- **Task API**: The `namespace` option has been renamed to `projectNamespace`. For more information, check the documentation for [CustomTasks API](../pages/extensibility/CustomTasks.md#task-implementation)  

- **New Option**: Added a new `async` option for `builder.bundles.bundleDefinition.section`.

!!! example
    ```yaml
    builder:
      bundles:
        - bundleDefinition:
            name: "app.js"
            sections:
              - mode: require
                filters:
                  - some/app/Component.js
                resolve: true
                sort: true
                async: true
    ```

### Changes to @ui5/project

- **Default Workspace Name**: The default `workspaceName` is now `"default"` for API usage.

!!! example
    ```js
    import {graphFromPackageDependencies} from "@ui5/project/graph";
	
	graphFromPackageDependencies({
		/* workspaceName: "default" */
	});
    ```

- **Directory Naming**: The `ui5HomeDir` has been renamed to `ui5DataDir` in APIs.

!!! example
    ```js
    import Resolver from "@ui5/project/ui5Framework/Openui5Resolver";

    await Resolver.resolveVersion("1.120.15", {
        ui5DataDir: "~/.ui5",
        cwd: process.cwd()
    });
    ```

- **Dependencies**: The `@ui5/builder` is now an optional dependency to the `@ui5/project`

Consumers of the Node.js API that make use of the `ProjectGraph#build` method need to declare a dependency to `@ui5/builder` in their respective `package.json`. The package manager should ensure that the version fulfills the range specified in the `package.json` of `@ui5/project`.
