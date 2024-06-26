# Migrate to v4

!!! tip "In Development"
	**UI5 Tooling V4 is still in development 🚧**

	Please use UI5 Tooling V3 by installing the latest version via: `npm i --save-dev @ui5/cli@latest`

	And find the announcement blog post here: **[SAP Community: UI5 Tooling 3.0](https://blogs.sap.com/2023/02/10/ui5-tooling-3.0/)**

## Node.js and npm Version Support

**This release requires Node.js versions v20.11.0, v21.2.0 or higher as well as npm v10 or higher.**
Support for older Node.js and npm releases has been dropped and will cause an error.

## Specification Versions Support

Going forward, **only projects with Specification Versions 2.0 and higher are supported.**

If a legacy specification version is detected, **an automatic migration is attempted.**
Your old projects might therefore still work unless they have a non-standard configuration in their ui5.yaml.

## Changes for Projects

!!! info
    ✅ Projects defining **Specification Version 2.x** are expected to be **fully compatible with UI5 Tooling v4**

For projects defining the latest **Specification Versions 4.0 and higher**, some changes apply:

* **Breaking Change:** Remove the bundle option `usePredefineCalls`. UI5 CLI v4.0.0 and above will always use `sap.ui.predefine` calls in bundles, making this option obsolete. See [Configuration](../pages/Configuration.md#properties) for details.

* **Breaking Change:** New `async` option for `builder.bundles.bundleDefinition.section` with default value = `true`; only applicable if mode = "require". See [Configuration: `bundleDefinition.section`](../pages/Configuration.md#properties) for details.

See also [Configuration: Specification Version 4.0](../pages/Configuration.md#specification-version-40).

## Migrate Your Code 


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
