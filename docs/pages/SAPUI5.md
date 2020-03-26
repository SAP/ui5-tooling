# Consuming SAPUI5 libraries

!!! info
    **Make sure you have installed the latest UI5 CLI in version 2.0 or later:**

## Overview

SAPUI5 libraries are hosted on the public npm registry at `registry.npmjs.org`. However, you should not install them using node package managers like npm or Yarn. Instead, please let the UI5 Tooling handle them by following this guide.

## Usage
Since version 2.0 the UI5 CLI will automatically download all required framework dependencies of a project if they are defined in the corresponding `ui5.yaml` configuration. They will be cached in a `.ui5` directory located in your users home directory. This happens transparently whenever you are executing `ui5 serve` or `ui5 build` commands.

All non-framework dependencies, like reuse libraries or UI5 Tooling extensions should still be maintained as npm dependencies in the projects `package.json`. At the same time, framework dependencies listed in the `ui5.yaml` should not be listed in the `package.json`.


## Configuration

There is a new configuration section dedicated to framework dependency handling.

**Example:**
```yaml
specVersion: "2.0"
type: application
metadata:
  name: some.project.name
framework:
  name: SAPUI5
  version: 1.76.0
  libraries:
    - name: sap.ui.core
    - name: sap.m
    - name: sap.ui.comp
    - name: sap.ushell
      development: true
    - name: themelib_sap_fiori_3
```

**Example:**
```yaml
specVersion: "2.0"
type: library
metadata:
  name: some.library
framework:
  name: SAPUI5
  libraries:
    - name: sap.ui.core
    - name: themelib_sap_belize
      optional: true
    - name: themelib_sap_bluecrystal
      optional: true
    - name: themelib_sap_fiori_3
      optional: true
```

Make sure that your project defines [Specification Version 2.0](./Configuration.md#specification-version-20) or higher.

For details, please see the corresponding [framework configuration documentation](././Configuration.md#framework-configuratio).

### Differences Between OpenUI5 and SAPUI5

The open source project [OpenUI5](https://openui5.org/) provides most of the fundamental framework features. [SAPUI5](https://ui5.sap.com/) enhances on this by providing additional libraries under a different license.

OpenUI5 is provided under the Apache 2.0 license. The SAPUI5 packages that are consumed in the UI5 Tooling are provided under the terms of the [SAP Developer License Agreement](https://tools.hana.ondemand.com/developer-license-3.1.txt).

Note that projects which use the OpenUI5 framework can not depend on projects that use the SAPUI5 framework.

Please also see the [UI5 SDK documentation "SAPUI5 vs. OpenUI5"](https://ui5.sap.com/#/topic/5982a9734748474aa8d4af9c3d8f31c0).
