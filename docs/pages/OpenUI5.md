# Consuming OpenUI5 Libraries

OpenUI5 consumption with UI5 Tooling is very similar to SAPUI5 consumption. Please refer to the documentation on [SAPUI5 Development With the UI5 Tooling](./SAPUI5.md) for a general description of how UI5 Tooling can fetch and provide framework dependencies to your project.

Note that projects using the SAPUI5 framework can depend on projects using the OpenUI5 framework. However, OpenUI5 projects can't depend on SAPUI5 projects.

Please also refer to our documentation on the [differences between OpenUI5 and SAPUI5](./FAQ.md#whats-the-difference-between-openui5-and-sapui5).

!!! info
    The minimum OpenUI5 version that can be consumed by UI5 Tooling is **1.52.5**

## Configuration
Your project's `ui5.yaml` provides a configuration section dedicated to framework dependency handling.

This configuration can be maintained by editing the file, or by using the UI5 CLI:

!!! example
      Using the [UI5 CLI](./CLI.md):
      ```sh
      ui5 use openui5@latest
      ui5 add sap.ui.core sap.m sap.ui.table themelib_sap_fiori_3
      ```

**Example ui5.yaml of an application**
```yaml
specVersion: "2.2"
type: application
metadata:
  name: some.project.name
framework:
  name: OpenUI5
  version: 1.76.0
  libraries:
    - name: sap.ui.core
    - name: sap.m
    - name: sap.ui.table
    - name: themelib_sap_fiori_3
```

**Example ui5.yaml of a library**
```yaml
specVersion: "2.2"
type: library
metadata:
  name: some.library
framework:
  name: OpenUI5
  libraries:
    - name: sap.ui.core
    - name: themelib_sap_belize
      optional: true
    - name: themelib_sap_bluecrystal
      optional: true
    - name: themelib_sap_fiori_3
      optional: true
```

Please make sure that your project defines [Specification Version 2.0](./Configuration.md#specification-version-20) or higher.

For details, please see the corresponding [framework configuration documentation](./Configuration.md#framework-configuration).

## OpenUI5 Framework Development
Please refer to the [OpenUI5 Framework Development Documentation](https://github.com/SAP/openui5/blob/master/docs/developing.md#developing-ui5).
