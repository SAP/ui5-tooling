- Start Date: 2019-04-23
- RFC PR: [#151](https://github.com/SAP/ui5-tooling/pull/151)
- Issue: [#113](https://github.com/SAP/ui5-server/issues/113)
- Affected components
    + [ ] [ui5-builder](https://github.com/SAP/ui5-builder)
    + [x] [ui5-server](https://github.com/SAP/ui5-server)
    + [ ] [ui5-cli](https://github.com/SAP/ui5-cli)
    + [ ] [ui5-fs](https://github.com/SAP/ui5-fs)
    + [x] [ui5-project](https://github.com/SAP/ui5-project)
    + [ ] [ui5-logger](https://github.com/SAP/ui5-logger)

# RFC 0005 Server Middleware Extensibility
## Summary
Add a feature to load custom or third party server middleware from `npm` dependencies. 

## Motivation
Currently the UI5 Server comes with a fixed set of middleware, which can not be extended.
A developer may want to handle requests differently. For example the developer wants to add various headers to a response
or parse data of a POST request in a specific way.

Custom or existing third party middleware can provide the required behavior.

## Detailed design
### Configuration
In a projects `ui5.yaml` file, a new configuration option should be added to define additional server middleware modules that 
shall be executed when the request is received by the server. This configuration shall only affect the
server started in this project. Custom middleware configuration of dependencies shall be ignored. 

A middleware may be executed before or after any other middleware.
This shall be configurable in a simple but less generic way.

Custom and third party server middleware modules (from `npm` dependencies) are treated differently and have their own
configuration sections (`customMiddleware` and `npmMiddleware`).

A project configuration might look like this:
```yaml
specVersion: "1.0"
type: application
metadata:
  name: my.application
server:
  customMiddleware:
    - name: myCustomMiddleware
      mountPath: /myapp
      afterMiddleware: compression
      configuration:
        debug: true
  npmMiddleware:
    - name: helmet
      mountPath: /
      beforeMiddleware: cors
```

In the above sample the middleware `cors` and `compression` are already included by the UI5 Server.

When serving the application `my.application`, this will execute the third party middleware `helmet` before
`cors` and the custom middleware `myCustomMiddleware` after `compression`.

For custom server middleware, there can be optional `configuration` parameters which are passed
directly to it with `options.configuration`. This is not possible for third party server middleware. 

An optional `mountPath` for which the middleware function is invoked, can be provided for both sections.
It will be passed to the `app.use` call (see [express API reference](https://expressjs.com/en/4x/api.html#app.use)).

### Generic handling of extensions
**This section is partially equal to what is outlined in [RFC 0001](https://github.com/SAP/ui5-tooling/blob/rfc-type-ext/rfcs/0001-type-extensibility.md#generic-handling-of-extension).**

Custom middleware implementations have similar characteristics than other possible "extensions" of the
UI5 Tooling. Examples for other extensions include "Shims" ([RFC 0002](https://github.com/SAP/ui5-tooling/blob/master/rfcs/0002-project-shims.md)), tasks 
([RFC 0004](https://github.com/SAP/ui5-tooling/blob/master/rfcs/0004-simple-build-extensibility.md)), and translators.

To separate "UI5 Projects" (i.e. things that represent UI5-artifacts for the browser) from tooling specific things
like "extensions", an additional attribute "kind" is added to the ui5.yaml.

A custom middleware will consist of at least a ui5.yaml defining it as an extension and
a JavaScript implementation.

A third party middleware which do not contain a ui5.yaml will be taken as it is.
In this case the server expects the [default express API](https://expressjs.com/en/guide/writing-middleware.html). 
The configured module name will be required directly by the UI5 Server, i.e. it will not be treated as a
`server-middleware` extension.  

If the third party middleware requires additional parameters, a custom middleware wrapper needs to be implemented.

#### Example middleware extension
**`ui5.yaml`**:
```yaml
specVersion: "1.0"
kind: extension
type: server-middleware
metadata:
  name: myCustomMiddleware
middleware:
  path: middleware/myCustomMiddleware.js
```

**`middleware/myCustomMiddleware.js`**:
```js
module.exports = function({resources, options}) {
	return function (req, res, next) {
		resources.all.byPath("/resources/sap/ui/core/Core.js").then(() => {
			// middleware code...
			res.end();
		}).catch((err) => {
			next(err);
		});
	};
};
```

#### Collecting and applying server middleware
A middleware extension might be a standalone module or part of a project.

If the extension is part of a project, the single `ui5.yaml` for the above example might look like this:

```yaml
specVersion: "1.0"
kind: project
type: application
metadata:
  name: my.application
server:
  customMiddleware:
    - name: myCustomMiddleware
      beforeMiddleware: compression
      mountPath: /myapp
      configuration:
        debug: true
---
specVersion: "1.0"
kind: extension
type: middleware
metadata:
  name: myCustomMiddleware
middleware:
  path: middleware/myCustomMiddleware.js
```

In this case the extension is no dependency of any kind but automatically collected when the server is started.

The UI5 Server will detect the custom middleware configuration of the project my.application and inject the middleware
into the servers start process to be available for the following HTTP requests.

##### Execution order
The order of the middleware is important. In the following it is decribed in which order the middleware is executed.
1. The section `customMiddleware` before `npmMiddleware`. This means, if a custom and a third party middleware from
should be both applied before or after the same middleware, the custom middlware will be executed first.  
2. Multiple middleware configurations within the same section are executed in the provided order. 

### Server middleware implementation
A custom middleware implementation needs to return a function with the following signature (written in JSDoc):
```js
/**
 * Custom UI5 Server middleware example
 *
 * @param {Object} parameters Parameters
 * @param {Object} parameters.resources Resource collections
 * @param {module:@ui5/fs.AbstractReader} parameters.resources.all Reader or Collection to read resources of the
 *                                        root project and its dependencies
 * @param {module:@ui5/fs.AbstractReader} parameters.resources.rootProject Reader or Collection to read resources of
 *                                        the project the server is started in
 * @param {module:@ui5/fs.AbstractReader} parameters.resources.dependencies Reader or Collection to read resources of
 *                                        the projects dependencies
 * @param {Object} parameters.options Options
 * @param {string} [parameters.options.configuration] Custom server middleware configuration if given in ui5.yaml
 * @returns {Promise<function> | function} Promise resolving with the middleware function to use or the middleware function
 */
module.exports = async function({resources, options}) { // optional async
	return function (req, res, next) {
		resources.all.byPath("/resources/sap/ui/core/Core.js").then(() => {
			// middleware code...
			res.end();
		}).catch((err) => {
			next(err);
		});
	}
};
```

## How we teach this
- Documentation about how to implement custom middleware
- Explanation of the UI5 Server middleware concept

## Drawbacks
Custom middleware configurations might break with future changes to the UI5 Server due to 
reordering of the pre-included middleware.

## Alternatives

## Unresolved questions
