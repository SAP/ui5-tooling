# FAQ
### How can I contribute?
Please check our [Contribution Guidelines](https://github.com/SAP/ui5-tooling/blob/master/CONTRIBUTING.md).

### How can I obtain support?
Please follow our [Contribution Guidelines](https://github.com/SAP/ui5-tooling/blob/master/CONTRIBUTING.md#report-an-issue) on how to report an issue.

### Why package.json? / Why npm?
Currently, the tooling can only resolve dependencies defined in a `package.json` file. This might change in the future by adding Translators for additional dependency management systems.

To manage your dependencies, you can use almost any `Node.js` package manager that relies on `package.json` files. Popular ones are [npm](https://www.npmjs.com/), [Yarn](https://yarnpkg.com/) and [pnpm](https://pnpm.js.org/).

The UI5 Tooling resolves dependencies almost the same way Node.js does when executing a `require` statement.

### What's the thing with Yarn?
In a couple of guides we refer to the [Yarn](https://yarnpkg.com/) node package manager. This is because it offers functionality that the otherwise preferred [npm](https://www.npmjs.com/) package manager is currently lacking. Namely, the [workspace](https://yarnpkg.com/lang/en/docs/workspaces/) setting which is currently used in the [OpenUI5 (mono-)repository](https://github.com/SAP/openui5). Note that npm [might add](https://github.com/npm/npm/pull/15900#issuecomment-315335381) this feature in the future.

If you do not plan to work with OpenUI5, you may as well use npm or any other node package manger (see [FAQ: Why package.json? / Why npm?](#why-packagejson-why-npm)). Keep in mind that linking the same module with npm and Yarn may cause issues. Also, Yarn can't work with links created by npm and vice versa. 

### Where are the npm packages?
[Here](https://www.npmjs.com/org/openui5) (OpenUI5 Libraries) and [here](https://www.npmjs.com/org/ui5) (UI5 Tooling).
