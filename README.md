![UI5 logo](./docs/images/UI5_logo_wide.png)

# [UI5](https://ui5.sap.com) Build and Development Tooling
> An open and modular toolchain to develop state-of-the-art applications based on the [UI5](https://ui5.sap.com) framework.

[![OpenUI5 Community Slack (#tooling channel)](https://img.shields.io/badge/slack-join-44cc11.svg)](https://join-ui5-slack.herokuapp.com)
[![Travis CI Build Status](https://travis-ci.org/SAP/ui5-tooling.svg?branch=master)](https://travis-ci.org/SAP/ui5-tooling)

**This is an alpha release!**  
**The UI5 Build and Development Tooling described here is not intended for productive use yet. Breaking changes are to be expected.**  
*(This is about to change, see [[Roadmap] Production ready UI5 CLI](https://github.com/SAP/ui5-tooling/issues/92))*

## Resources
- [API Reference](https://sap.github.io/ui5-tooling/)
- [CLI Documentation](https://github.com/SAP/ui5-cli#cli-usage)
- [Project Configuration](https://github.com/SAP/ui5-project/blob/master/docs/Configuration.md)
- 🎬 [UI5con@SAP 2018 Talk](https://www.youtube.com/watch?v=iQ07oe26y_k)
- [Contribution Guidelines](./CONTRIBUTING.md)
- [Roadmap](https://github.com/SAP/ui5-tooling/issues/101)

## Modules
- [ui5-cli](https://github.com/SAP/ui5-cli): UI5 Command Line Interface, utilizing all of the following modules
- [ui5-server](https://github.com/SAP/ui5-server): Modules for running a UI5 development server
- [ui5-project](https://github.com/SAP/ui5-project): Modules for building a UI5 projects dependency tree, including configuration
- [ui5-builder](https://github.com/SAP/ui5-builder): Modules for building UI5 projects
- [ui5-fs](https://github.com/SAP/ui5-fs): UI5 specific file system abstraction
- [ui5-logger](https://github.com/SAP/ui5-logger): Internal logging module

**Usage Overview** *(arrows indicate dependencies)*
![Module Overview](./docs/images/Module_overview.png)

## Installing the UI5 CLI
### Requirements
- [Node.js](https://nodejs.org/) (**version 8.5 or higher** ⚠️)

### Installation
```sh
npm install --global @ui5/cli

# Verify installation
ui5 --help
```

## ⚡️ Quick Start: OpenUI5 Sample App
Check out the [OpenUI5 Sample App](https://github.com/SAP/openui5-sample-app) featuring a full blown [How-to](https://github.com/SAP/openui5-sample-app/#openui5-sample-app) to play around with the UI5 Build and Development Tooling.

## Enable an Existing Project
You can easily check whether or not a project (application or library) can already be used with the UI5 Build and Development Tooling by looking for a `ui5.yaml` file in the project's root directory.  
This file (with some exceptions) is required for all projects and their dependencies (e.g. reuse libraries) to use them in the UI5 Build and Development Tooling.

### Setup
If your project is not set up for use with the UI5 Build and Development Tooling yet, follow these steps:

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

Questions? Check the [FAQ](#faq)!

## Working With the UI5 Build and Development Tooling
When developing a UI5 project locally, you should use the UI5 Server (`ui5 serve`) and not the UI5 Builder (`ui5 build`). Building a project should only ever be required when deploying it.

However, you might have good reasons to also use the UI5 Builder during development. In such cases, feel free to let us know! Maybe your use case could be covered by a future enhancement of the UI5 Server.

## Project Configuration
For details about how to configure a UI5 project (e.g. using a `ui5.yaml`), see [ui5-project - Configuration](https://github.com/SAP/ui5-project#configuration).

## Linking Projects
Would you like to work on an application project and one or more of its dependencies at the same time? We got you covered!

By leaving dependency management up to the tool of your choice (see [FAQ: Why package.json? / Why npm?](#why-packagejson-why-npm)) you have a variety of options.  
Here is an example with [npm](https://www.npmjs.com/get-npm), an application, and a reuse library:

**Example: Your Directory Structure**
```
my-app/
    \_ node_modules/
    \_ webapp/
    \_ ui5.yaml
    \_ package.json
my-reuse-library/
    \_ node_modules/
    \_ src/
    \_ test/
    \_ ui5.yaml
    \_ package.json
```

In its `package.json`, `my-app` should already define a dependency to `my-reuse-library`. So, after running the `npm install` command, a copy of the "my-reuse-library"-package should be retrieved from the package registry and added to my-app's `node_modules/` directory.

Now all you need to do is replacing this copy of the `my-reuse-library` package with a  link to the `my-reuse-library` project located somewhere on your computer. In this example it is right next to `my-app`, but that doesn't really matter.

First, in the directory of the `my-reuse-library` project, create a global link:
```sh
npm link
```

Then, in the `my-app` directory, use that link to replace the registry package:
```sh
npm link my-reuse-library
```
_**Note:** "my-reuse-library" is the name defined in the `package.json` and not necessarily the directory or `ui5.yaml` name_

That's it. You can check whether the linking worked by executing `ui5 tree` in the `my-app` directory and looking for the path attributes in its output:
```
├─ id: my-app
├─ version: 1.0.0
├─ path: /my-app
└─ dependencies
     ├─ 0
     │  ├─ id: my-reuse-library
     │  ├─ version: 1.0.0
     │  ├─ path: /my-reuse-library
     │  └─ dependencies
[...]
```

## OpenUI5 Framework Development
See [SAP/openui5 Developing UI5](https://github.com/SAP/openui5/blob/master/docs/developing.md#developing-ui5).
        
## HTTP/2 Development Webserver
The UI5 Build and Development Tooling contains a web server to serve the project via HTTP/2 protocol.

```sh
ui5 serve --h2
```

This requires an SSL certificate. You are guided through the automatic generation process.

## Integration in Other Tools
One of the key features of the UI5 Build and Development Tooling is its modularization. Single parts of the tooling can easily be integrated in other `Node.js`-based tools and frameworks like [Grunt](https://gruntjs.com/) or [Gulp](https://gulpjs.com/).

All JavaScript APIs available for direct consumption are listed [here](https://sap.github.io/ui5-tooling/). However, for standard UI5 development, the [UI5 CLI](https://github.com/SAP/ui5-cli) should always be the first choice.

## FAQ
### How can I contribute?
Please check our [Contribution Guidelines](https://github.com/SAP/ui5-tooling/blob/master/CONTRIBUTING.md).

### How can I obtain support?
Please follow our [Contribution Guidelines](https://github.com/SAP/ui5-tooling/blob/master/CONTRIBUTING.md#report-an-issue) on how to report an issue.

### Why package.json? / Why npm?
Currently, the tooling can only resolve dependencies defined in a `package.json` file. This might change in the future by adding Translators for additional dependency management systems.

To manage your dependencies, you can use almost any `Node.js` package manager that relies on `package.json` files. Popular ones are [npm](https://www.npmjs.com/), [Yarn](https://yarnpkg.com/) and [pnpm](https://pnpm.js.org/).

The UI5 Build and Development Tooling resolves dependencies almost the same way Node.js does when executing a `require` statement.

### What's the thing with Yarn?
In a couple of guides we refer to the [Yarn](https://yarnpkg.com/) node package manager. This is because it offers functionality that the otherwise preferred [npm](https://www.npmjs.com/) package manager is currently lacking. Namely, the [workspace](https://yarnpkg.com/lang/en/docs/workspaces/) setting which is currently used in the [OpenUI5 (mono-)repository](https://github.com/SAP/openui5). Note that npm [might add](https://github.com/npm/npm/pull/15900#issuecomment-315335381) this feature in the future.

If you do not plan to work with OpenUI5, you may as well use npm or any other node package manger (see [FAQ: Why package.json? / Why npm?](#why-packagejson-why-npm)). Keep in mind that linking the same module with npm and Yarn may cause issues. Also, Yarn can't work with links created by npm and vice versa. 

### Where are the npm packages?
[Here](https://www.npmjs.com/org/openui5) (OpenUI5 Libraries) and [here](https://www.npmjs.com/org/ui5) (UI5 Tooling).

## Contributing
Please check our [Contribution Guidelines](https://github.com/SAP/ui5-tooling/blob/master/CONTRIBUTING.md).

## Support
Please follow our [Contribution Guidelines](https://github.com/SAP/ui5-tooling/blob/master/CONTRIBUTING.md#report-an-issue) on how to report an issue. Or chat with us in the `#tooling` channel of the [OpenUI5 Community Slack](https://slackui5invite.herokuapp.com)

## License
This project is licensed under the Apache Software License, Version 2.0 except as noted otherwise in the [LICENSE](https://github.com/SAP/ui5-tooling/blob/master/LICENSE.txt) file.
