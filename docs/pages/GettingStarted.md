# Getting Started
## Installing the UI5 CLI
### Requirements
- [Node.js](https://nodejs.org/) (**version 10 or higher** ⚠️)

### Installation
```sh
npm install --global @ui5/cli

# Verify installation
ui5 --help
```

## ⚡️ Quick Start: OpenUI5 Sample App
Check out the [OpenUI5 Sample App](https://github.com/SAP/openui5-sample-app) featuring a full blown [How-to](https://github.com/SAP/openui5-sample-app/#openui5-sample-app) to play around with the UI5 Tooling.

## Enable an Existing Project
You can easily check whether or not a project (application or library) can already be used with the UI5 Tooling by looking for a `ui5.yaml` file in the project's root directory.  
This file (with some exceptions) is required for all projects and their dependencies (e.g. reuse libraries) to use them in the UI5 Tooling.

### Setup
If your project is not set up for use with the UI5 Tooling yet, follow these steps:

1. **If** your project does not have a `package.json` file yet, let npm generate it:
    ```sh
    npm init --yes
    ```

1. Generate the `ui5.yaml` file:
    ```sh
    ui5 init
    ```

1. Install npm dependencies required for your project:
    ```sh
    npm install @openui5/sap.ui.core @openui5/themelib_sap_belize [...]
    ```
    For a full list of all available OpenUI5 libraries, see [www.npmjs.com/org/openui5](https://www.npmjs.com/org/openui5)

1. If you are using Git or similar version control, commit `package.json` and `ui5.yaml` to your repository.
