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

1. If your project does not have a `package.json` file, let npm generate it:
    ```sh
    npm init --yes
    ```

1. Generate the `ui5.yaml` file:
    ```sh
    ui5 init
    ```

1. Define the framework you want to use

    You can choose between the OpenUI5 and the SAPUI5 Framework. Don't know which one to choose? Check out our [documentation on the differences between OpenUI5 and SAPUI5](./SAPUI5.md#differences-between-openui5-and-sapui5).

    **[OpenUI5](https://openui5.hana.ondemand.com/)**
    ```sh
    ui5 use openui5@latest
    ```

    **[SAPUI5](https://ui5.sap.com/)**
    ```sh
    ui5 use sapui5@latest
    ```

1. Add required libraries
    ```sh
    ui5 add sap.ui.core sap.m themelib_sap_fiori_3 # [...]
    ```

1. If you are using Git or similar version control, commit `package.json` and `ui5.yaml` to your repository.

Hooray! 🎉 You can now use the UI5 Tooling in your project!

Execute [`ui5 serve`](./pages/Server.md) to start a local development server or use [`ui5 build --all`](./pages/Builder.md) to create an optimized version of your project, including all of its dependencies which you can deploy from the created `./dist` directory.
