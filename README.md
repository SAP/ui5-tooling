![UI5 logo](./docs/images/UI5_logo_wide.png)

# [UI5](https://ui5.sap.com) Build and Development Tooling
[![OpenUI5 Community Slack (#tooling channel)](https://slackui5invite.herokuapp.com/badge.svg)](https://slackui5invite.herokuapp.com)

**This is a Pre-Alpha release!**  
**The UI5 Build and Development Tooling described here is not intended for productive use yet. Breaking changes are to be expected.**

## Documents
- [API Reference](https://github.com/pages/SAP/ui5-tooling)
- [CLI Documentation](https://github.com/SAP/ui5-cli#cli-usage)

## Modules
- [ui5-cli](https://github.com/SAP/ui5-cli): UI5 Command Line Interface, utilizing all of the following modules
- [ui5-builder](https://github.com/SAP/ui5-builder): Modules for building UI5 projects
- [ui5-server](https://github.com/SAP/ui5-server): Modules for running a UI5 development server
- [ui5-fs](https://github.com/SAP/ui5-fs): UI5 specific file system abstraction
- [ui5-project](https://github.com/SAP/ui5-project): Modules for building a UI5 projects dependency tree, including configuration
- [ui5-logger](https://github.com/SAP/ui5-logger): Internal logging module

## Installing the UI5 CLI
### Requirements
- [Node.js](https://nodejs.org/) (**version must be 8.3 or higher** ⚠️)
- Optional: Yarn ([yarnpkg.com](https://yarnpkg.com/en/docs/install))  
    *Yarn is currently required when working with the [OpenUI5 main repository](https://github.com/SAP/openui5). See [FAQ: What's the thing with Yarn?](#whats-the-thing-with-yarn)*

### Installation
Apparently, the modules that make up the UI5 Build and Development Tooling are not yet available on npm. See [FAQ: Where are the npm packages?](#where-are-the-npm-packages)

```sh
# Clone the repository
git clone https://github.com/SAP/ui5-cli.git
 
# Navigate into the repositroy
cd ui5-cli

# Install all dependencies
npm install

# Link the module globally
npm link

# Test
ui5 --help
# This should output something like: Usage: ui5 <command> [options]...
```

## ⚡️ Quick start: OpenUI5 Sample App
Checkout the [OpenUI5 Sample App (`ui5-tooling` branch)](https://github.com/SAP/openui5-sample-app/tree/ui5-tooling) featuring a full blown [How-to](https://github.com/SAP/openui5-sample-app/tree/ui5-tooling#openui5-sample-app) to play around with the UI5 Build and Development Tooling.

## Enable an existing Project
You can easily check whether or not a project (application or library) can already be used with the UI5 Build and Development Tooling by looking for a `ui5.yaml` file in the projects root directory.  
This file (with some exceptions) is required for all projects and their dependencies (e.g. reuse libraries) to use them in the UI5 Build and Development Tooling.

### Setup
If your project is not setup for use with the UI5 Build and Development Tooling yet, follow these steps:
1. **If** your project does not have a `package.json` file yet, let npm generate it
    ```sh
    npm init --yes
    ```

1. Generate the ui5.yaml file
    ```sh
    ui5 init
    ```

1. ~Install npm dependencies required for your project~  
    ```sh
    # npm install @openui5/sap.ui.core @openui5/themelib_sap_belize [...]
    ```
    ⚠️  **Note:** This is not yet possible (see [FAQ: Where are the npm packages?](#where-are-the-npm-packages)).  
    Please follow [Linking Projects](#linking-projects) instead to create local links for your projects dependencies. You still need to add all dependencies to your projects `package.json`.

1. If you are using Git or similar version control, commit `package.json` and `ui5.yaml` to your repository

Questions? Check the [FAQ](#faq)!

## Linking Projects
You would like to work on an application project and one or more of its dependencies at the same time? We got you covered!

By leaving dependency management up to the tool of your choice (see [FAQ: Why package.json? / Why npm?](#why-packagejson-why-npm)) you have a variety of choices.  
Let's have an example with [Yarn](https://yarnpkg.com/), an application and a reuse library:

**Example: Your directory structure**
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

In its `package.json`, my-app should already define a dependency to my-reuse-library. So after running the `yarn` command, a copy of the "my-reuse-library"-package should be retrieved from the package registry and added to my-app's `node_modules/` directory.

Now all you need to do is replacing this copy of my-reuse-library package with a  link to the my-reuse-library project located somewhere on your computer. In this example it is right next to my-app, but that doesn't really matter.

First, in the directory of the my-reuse-library project, create a global link:
```sh
yarn link
```

Then, in the my-app direcotry, use that link to replace the registry package:
```sh
yarn link my-reuse-library
```
_**Note:** "my-reuse-library" is the name defined in the package.json. Not necessarily the directory or ui5.yaml name_

That's it. You can check whether the linking worked by executing `ui5 tree` in the my-app directory and looking for the path attributes in its output:
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
1. Clone the OpenUI5 repository and navigate into it
    ```sh
    git clone git@github.com:SAP/openui5.git
    cd openui5/
    ```
1. Install all dependencies and create links between the OpenUI5 libraries (see [FAQ: What's the thing with Yarn?](#whats-the-thing-with-yarn))
    ```sh
    yarn
    ```
1. Run the OpenUI5 testsuite
    ```sh
    cd src/testsuite/
    ui5 serve -o /index.html
    ```
        
## HTTP/2 Development Webserver
The UI5 Build and Development Tooling contain a webserver to serve the project via HTTP/2 protocol.

```sh
ui5 serve --h2
```

This will require an SSL certificate. You will be guided through the automatic generation process.

## Advanced: Integration into other Build and Development Tooling
One of the key features of the UI5 Build and Development Tooling is its modularization. This allows for easy integration into other Node.js based tools and frameworks with a fairly low footprint. 

The UI5 Build and Development CLI focuses on providing the best possible workflow for straight forward, best practice UI5 application and library development.  
But if your project requires some additional build steps. If you already came up with your own set of tools to build and develop. Or if you want to define custom workflows, maybe with the help of task runners like [Grunt](https://gruntjs.com/) or [Gulp](https://gulpjs.com/). Then you can make use of various modules that build up to the UI5 Build and Development Tooling.

## FAQ
### How can I contribute?
Please check our [Contribution Guidelines](/CONTRIBUTING.md).

### How can I obtain support?
Please follow our [Contribution Guidelines](/CONTRIBUTING.md#report-an-issue) on how to report an issue.

### Why package.json? / Why npm?
Currently, the tooling can only resolve dependencies defined in a `package.json` file. This might change in the future by adding Translators for additional dependency management systems.

To manage your dependencies you can use almost any Node package manager that relies on `package.json` files. Popular ones are [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/) and [pnpm](https://pnpm.js.org/).

The UI5 Build and Development Tooling resolve dependencies (almost) the same way Node.js does when executing a `require` statement.

### What's the thing with Yarn?
In a couple of guides we refer to the [yarn](https://yarnpkg.com/) node package manager. This is because it offers functionality that the otherwise prefered [npm](https://www.npmjs.com/) package manager is currently lacking of. Namely the [workspace](https://yarnpkg.com/lang/en/docs/workspaces/) setting which is currently used in the [OpenUI5 (mono-)repository](https://github.com/SAP/openui5). Note that npm [might add](https://github.com/npm/npm/pull/15900#issuecomment-315335381) this feature in the future.

If you do not plan to work with OpenUI5 you might as well use npm or any other node package manger (see [FAQ: Why package.json? / Why npm?](#why-packagejson-why-npm). But keep in mind that linking the same module with npm and Yarn might lead to issues. Also, Yarn can't work with links created by npm and vice versa. 

### Where are the npm packages?
Apparently, the modules of the UI5 Build and Development Tooling as well as the OpenUI5 libraries are not yet available on the public npm registry. We are working on publishing them as soon as possible. Stay tuned!

## Contributing
Please check our [Contribution Guidelines](/CONTRIBUTING.md).

## Support
Please follow our [Contribution Guidelines](/CONTRIBUTING.md#report-an-issue) on how to report an issue. Or chat with us in the `#tooling` channel of the [OpenUI5 Community Slack](https://slackui5invite.herokuapp.com)

## License
This project is licensed under the Apache Software License, Version 2.0 except as noted otherwise in the [LICENSE](/LICENSE.txt) file.
