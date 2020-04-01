# Migrate to v2

v2.0.0 of the UI5 Tooling was released on April 1, 2020. As a major feature, it introduces the easy consumption of SAPUI5 libraries in UI5 projects.

## Breaking changes
**All UI5 Tooling Modules: Require Node.js >= 10**

Support for older Node.js releases has been dropped.

**UI5 Builder: Make namespace mandatory for application and library projects ([SAP/ui5-builder#430](https://github.com/SAP/ui5-builder/pull/430))**

The UI5 Tooling must be able to determine an application- or library project's namespace. Otherwise an error is thrown.

Ideally the namespace should be defined in the `sap.app/id` field of the [`manifest.json`](https://ui5.sap.com/#/topic/74038a52dcd7404e82b38be6d5fb1458)

In case of libraries, additional fallbacks are in place:

1. The `name` attribute defined in the `.library` file
2. The path of the `library.js` file

**UI5 Builder: LibraryFormatter: Ignore manifest.json of nested apps ([SAP/ui5-builder#392](https://github.com/SAP/ui5-builder/pull/392))**

If a library contains both, a manifest.json and .library file, they must either be located in the same directory or the manifest.json is ignored. In cases where the manifest.json is located on a higher level or different directory on the same level than a .library file, an exception is thrown.

**UI5 Server: serveResources middleware: Expect *.properties files in UTF-8 by default ([SAP/ui5-server#303](https://github.com/SAP/ui5-server/pull/303))**

When integrating the serveResources middleware directly into a custom server, it now handles `*.properties` files as being UTF-8 encoded.

_**Note:** This change does not affect you when you are using the UI5 Server as part of the UI5 CLI or use the top level [`server.serve`](https://sap.github.io/ui5-tooling/api/module-@ui5_server.server.html#.serve) API. In those cases the project specific [configuration](../pages/Configuration.md#encoding-of-properties-files) defines the encoding of `*.properties` files._

**UI5 FS: Remove deprecated parameter useNamespaces ([SAP/ui5-fs#223](https://github.com/SAP/ui5-fs/pull/223))**

Remove deprecated parameter `useNamespaces` from method [`resourceFactory.createCollectionsForTree`](https://sap.github.io/ui5-tooling/api/module-@ui5_fs.resourceFactory.html#.createCollectionsForTree). Use parameter `getVirtualBasePathPrefix` instead.

## How to upgrade

### Global installation

To upgrade your global installation, just run the installation command again, which will upgrade to the latest version.

```
npm install --global @ui5/cli
```

**Note:** Your local CLI installation will still be preferred, so you need to make sure to upgrade it as well (see [Local vs. Global installation](https://github.com/SAP/ui5-cli#local-vs-global-installation)).

### Local installation

To upgrade the CLI installation within a project you need to run the following command.

```
npm install @ui5/cli@^2
```

### ui5.yaml

#### `specVersion: '2.0'`

We have introduced the [specification version `2.0`](../pages/Configuration.md#specification-version-10).
New features will only be available for projects with specVersion `2.0` or newer.  
Most projects defining specVersion `0.1` or `1.0` can still be used.

```yaml
specVersion: '2.0'
metadata:
  name: <project-name>
type: <project-type>
```
