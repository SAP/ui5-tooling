# Custom UI5 Server Middleware

The UI5 Server Extensibility enables you to enhance the functionality of the UI5 Server. You may want to handle requests differently. For example add various headers to a response or parse data of a POST request in a specific way. For this you can plug custom middleware implementations into the internal [express](https://expressjs.com/) server of the UI5 Server module.

## Configuration
In a projects `ui5.yaml` file, you can define additional server middleware modules that will be executed when the request is received by the server. This configuration exclusively affects the server started in this project. Custom middleware configurations defined in any dependencies are ignored.

A middleware may be executed before or after any other middleware.

### Example: Basic configuration
```yaml
specVersion: "2.0"
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
```

In the above sample the middleware `compression` is already included as a standard middleware by the UI5 Server.

When serving the application `my.application`, this will execute the custom middleware `myCustomMiddleware` after `compression`.

There can be optional configuration parameters which are passed directly to the custom middleware implementation (see below).

An optional mountPath for which the middleware function is invoked can be provided. It will be passed to the `app.use` call (see [express API reference](https://expressjs.com/en/4x/api.html#app.use)).

### Execution order
The order of the middleware is important. Multiple middleware configurations are applied in the provided order. 

## Custom Middleware Extension
A custom middleware extension consists of a `ui5.yaml` and a [custom middleware implementation](#custom-middleware-implementation). It can be a standalone module or part of an existing UI5 project.

### Example: ui5.yaml

````yaml
specVersion: "2.0"
kind: extension
type: server-middleware
metadata:
  name: markdownHandler
middleware:
  path: lib/middleware/markdownHandler.js
````

Custom middleware extensions can be **standalone modules** which are handled as dependencies.

Alternatively you can implement a custom middleware extension as **part of your UI5 project**.
In that case, the configuration of the extension is part of your project configuration inside the `ui5.yaml` as shown below.

The UI5 Server will detect the custom middleware configuration of the project and use the middleware on startup.

### Example: Custom Middleware Extension defined in UI5 project

````yaml
# Project configuration for the above example
specVersion: "2.0"
kind: project
type: application
metadata:
  name: my.application
server:
  customMiddleware:
    - name: markdownHandler
      beforeMiddleware: serveResources
---
# Custom middleware extension as part of your project
specVersion: "2.0"
kind: extension
type: server-middleware
metadata:
  name: markdownHandler
middleware:
  path: lib/middleware/markdownHandler.js
````

## Custom Middleware Implementation
A custom middleware implementation needs to return a function with the following signature:
````javascript
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
 * @returns {function} Middleware function to use
 */
module.exports = function({resources, options}) {
    return function (req, res, next) {
        // [...]
    }
};
````

### Example: lib/middleware/markdownHandler.js
````javascript
// Custom middleware implementation

module.exports = function({resources, options}) {
    const MarkdownIt = require('markdown-it');
    const md = new MarkdownIt();
    return function (req, res, next) {
        if (!req.path.endsWith(".html")) {
            // Do not handle non-HTML requests
            next();
            return;
        }
        // Try to read a corresponding markdown file
        resources.rootProject.byPath(req.path.replace(".html", ".md")).then(async (resource) => {
            if (!resource) {
                // No file found, hand over to next middleware
                next();
                return;
            }
            const markdown = await resource.getBuffer();
            // Generate HTML from markdown string
            const html = md.render(markdown.toString());
            res.type('.html');
            res.end(html);
        }).catch((err) => {
            next(err);
        });
    }
};
````

Live demo of the above example: https://github.com/SAP/openui5-sample-app/tree/demo-server-middleware-extensibility
