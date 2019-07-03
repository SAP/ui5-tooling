## Working With the UI5 Tooling
When developing a UI5 project locally, you should use the UI5 Server (`ui5 serve`) and not the UI5 Builder (`ui5 build`). Building a project should only ever be required when deploying it.

However, you might have good reasons to also use the UI5 Builder during development. In such cases, feel free to let us know! Maybe your use case could be covered by a future enhancement of the UI5 Server.

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
The UI5 Tooling contains a web server to serve the project via HTTP/2 protocol.

```sh
ui5 serve --h2
```

This requires an SSL certificate. You are guided through the automatic generation process.

## Integration in Other Tools
One of the key features of the UI5 Tooling is its modularization. Single parts of the tooling can easily be integrated in other `Node.js`-based tools and frameworks like [Grunt](https://gruntjs.com/) or [Gulp](https://gulpjs.com/).

All JavaScript APIs available for direct consumption are listed [here](https://sap.github.io/ui5-tooling/). However, for standard UI5 development, the [UI5 CLI](https://github.com/SAP/ui5-cli) should always be the first choice.