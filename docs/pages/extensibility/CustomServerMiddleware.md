# Custom UI5 Server Middleware

The UI5 Server Extensibility enables you to enhance the functionality of the UI5 Server. You may want to handle requests differently. For example add various headers to a response or parse data of a POST request in a specific way. For this you can plug custom or third party middleware implementations into the internal [express](https://expressjs.com/) server of the UI5 Server module.

## Configuration

In a projects `ui5.yaml` file, you can define additional server middleware modules that will be executed when the request is received by the server. This configuration exclusively affects the server started in this project. Custom middleware configurations defined in any dependencies are ignored.

A middleware may be executed before or after any other middleware.

### Example: Basic configuration
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
```

In the above sample the middleware `compression` is already included as a standard middleware by the UI5 Server.

When serving the application `my.application`, this will execute the custom middleware `myCustomMiddleware` after `compression`.

There can be optional configuration parameters which are passed directly to the custom middleware implementation (see below).

An optional mountPath for which the middleware function is invoked can be provided. It will be passed to the `app.use` call (see [express API reference](https://expressjs.com/en/4x/api.html#app.use)).