# FAQ
### How Can I Contribute?
Please check our [Contribution Guidelines](https://github.com/SAP/ui5-tooling/blob/master/CONTRIBUTING.md).

### How Can I Obtain Support?
Please follow our [Contribution Guidelines](https://github.com/SAP/ui5-tooling/blob/master/CONTRIBUTING.md#report-an-issue) on how to report an issue.

### What's the Difference Between OpenUI5 and SAPUI5?
The open source project [OpenUI5](https://openui5.org/) provides most of the fundamental framework features. [SAPUI5](https://ui5.sap.com/) enhances this by providing **additional libraries** under a **different license**.

OpenUI5 is provided under the Apache 2.0 license. The SAPUI5 packages that are consumed in UI5 Tooling are provided under the terms of the [SAP Developer License Agreement](https://tools.hana.ondemand.com/developer-license-3.1.txt).

Note that projects which use the OpenUI5 framework cannot depend on projects that use the SAPUI5 framework. However, SAPUI5 projects can depend on OpenUI5 projects.

Please also see the [UI5 SDK documentation "SAPUI5 vs. OpenUI5"](https://ui5.sap.com/#/topic/5982a9734748474aa8d4af9c3d8f31c0).

### Why package.json? / Why npm?
Currently, the tooling can only resolve dependencies defined in a `package.json` file. This might change in the future by adding Translators for additional dependency management systems.

To manage your dependencies, you can use almost any `Node.js` package manager that relies on `package.json` files. Popular ones are [npm](https://www.npmjs.com/), [Yarn](https://yarnpkg.com/) and [pnpm](https://pnpm.js.org/).

The UI5 Tooling resolves dependencies almost the same way Node.js does when executing a `require` statement.

### What's the Thing With Yarn?
In a couple of guides we refer to the [Yarn](https://yarnpkg.com/) node package manager. This is because it offers functionality that the otherwise preferred [npm](https://www.npmjs.com/) package manager is lacking in Version 6 and below. In particular, this applies to the [workspace](https://yarnpkg.com/lang/en/docs/workspaces/) setting, which is currently used in the [OpenUI5 (mono-)repository](https://github.com/SAP/openui5). Note that npm recently [added this feature to its v7 release](https://github.blog/2020-10-13-presenting-v7-0-0-of-the-npm-cli/).

If you do not plan to work with OpenUI5, you may as well use npm or any other node package manger (see [FAQ: Why package.json? / Why npm?](#why-packagejson-why-npm)). Keep in mind that linking the same module with npm and Yarn may cause issues. Also, Yarn can't work with links created by npm and vice versa. 

### Where are the npm Packages?

* [OpenUI5 Libraries](https://www.npmjs.com/org/openui5)
* [SAPUI5 Libraries](https://www.npmjs.com/org/sapui5)
* [UI5 Tooling Modules](https://www.npmjs.com/org/ui5)
