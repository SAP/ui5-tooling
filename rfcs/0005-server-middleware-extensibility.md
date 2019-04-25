- Start Date: 2019-04-23
- RFC PR: -
- Issue: -
- Affected components
    + [ ] [ui5-builder](https://github.com/SAP/ui5-builder)
    + [x] [ui5-server](https://github.com/SAP/ui5-server)
    + [ ] [ui5-cli](https://github.com/SAP/ui5-cli)
    + [ ] [ui5-fs](https://github.com/SAP/ui5-fs)
    + [ ] [ui5-project](https://github.com/SAP/ui5-project)
    + [ ] [ui5-logger](https://github.com/SAP/ui5-logger)

# RFC 0005 Server Middleware Extensibility
## Summary
Add a feature to load custom or third party server middleware. 

## Motivation
Currently the `ui5-server` comes with a fixed set of middleware, which can not be extended.
A developer may want to handle requests differently. For example the developer wants to add various headers to a response
or parse data of a POST request in a specific way.

Custom or existing third party middleware can provide the required behavior.

## Detailed design
### Configuration
In a projects `ui5.yaml` file, a new configuration option should be added to define additional server middlewares that 
shall be executed when the request is received by the server. This configuration shall only affect the
project it belongs to. The serve process of any of the other projects shall be unaffected by this configuration.

A middleware may be executed before or after any other middleware.
This shall be configurable in a simple but less generic way.

A project configuration might look like this:
```yaml
specVersion: "0.1"
type: application
metadata:
    name: my.application
server:
    customMiddleware:
    - name: helmet
      beforeMiddleware: cors
    - name: myCustomMiddleware
      afterMiddleware: compression
      configuration:
        path: /myapp
   ```
   
In the above sample the middleware `cors` and `compression` are already included in the `ui5-server`.

When serving the application `my.application`, this will execute the third party middleware `helmet` before
`cors` and the custom middleware `myCustomMiddleware` after `compression`.

### Generic handling of extensions
**This section is partially equal to what is outlined in [RFC 0001](https://github.com/SAP/ui5-tooling/blob/rfc-type-ext/rfcs/0001-type-extensibility.md#generic-handling-of-extension).**

Custom middleware implementations have similar characteristics than other possible "extensions" of the
UI5 Build and Development Tooling. Examples for other extensions include "Shims" ([RFC 0002](https://github.com/SAP/ui5-tooling/blob/master/rfcs/0002-project-shims.md)), tasks 
([RFC 0004](https://github.com/SAP/ui5-tooling/blob/master/rfcs/0004-simple-build-extensibility.md)), and translators.

To separate "UI5 Projects" (i.e. things that represent UI5-artifacts for the browser) from tooling specific things
like "extensions", an additional attribute "kind" is added to the ui5.yaml.

A custom middleware will consist of at least a ui5.yaml defining it as an extension and
a JavaScript implementation.

A third party middleware which do not contain a ui5.yaml will be taken as it is. In this case the server expects
the [default express API](https://expressjs.com/en/guide/writing-middleware.html). 

#### Example middleware extension
**`ui5.yaml`**:
```yaml
specVersion: "0.1"
kind: extension
type: middleware
metadata:
    name: myCustomMiddleware
middleware:
    path: middlewares/myCustomMiddleware.js
```

**`middlewares/myCustomMiddleware.js`**:
```js
module.exports = function({resourceCollections, tree}) {
    return function (req, res, next) {
      // middleware code...
      next();
    }
};
```

#### Collecting and applying server middleware
A middleware extension might be a standalone module or part of a project.

If the extension is part of a project, the single `ui5.yaml` for the above example might look like this:

```yaml
specVersion: "0.1"
kind: project
type: application
metadata:
    name: my.application
server:
    customMiddleware:
    - name: myCustomMiddleware
      afterMiddleware: compression
      configuration:
        path: /myapp
---
specVersion: "0.1"
kind: extension
type: middleware
metadata:
    name: myCustomMiddleware
middleware:
    path: middlewares/myCustomMiddleware.js
```

In this case the extension is no dependency of any kind but automatically collected when the server is started.

The `ui5-server` will detect the custom middleware configuration of the project my.application and inject the middleware
into the servers start process to be available for the following HTTP requests.


### Server middleware implementation
A custom middleware implementation needs to return a function with the following signature (written in JSDoc):
```js
/**
 * Custom ui5-server middleware example
 *
 * @param {Object} resourceCollections Contains the resource reader or collection to access project related files
 * @param {AbstractReader} resourceCollections.source Reader to access the projects source files.
 * @param {AbstractReader} resourceCollections.dependencies Reader or collecation to access the projects dependencies.
 * @param {ReaderCollectionPrioritized} resourceCollections.combo Contains a prioritized collection to read and write all project files. 
 * @returns {Function} Returns a middleware closure.
 */
module.exports = function({resourceCollections, tree}) {
    return function (req, res, next) {
      // middleware code...
      next();
    }
};
```

## How we teach this
- Documentation about how to implement custom middleware
- Explanation of the `ui5-server` middleware concept

## Drawbacks
Custom middleware configurations might break with future changes to the `ui5-server` due to 
reordering of the pre-included middleware.

## Alternatives

## Unresolved questions
