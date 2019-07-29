# UI5 Server
The [UI5 Server](https://github.com/SAP/ui5-server) provides server capabilities for the [UI5 Tooling](https://github.com/SAP/ui5-tooling).

## Middleware
The development server has already a set of middleware which supports the developer with the following features:

* Escaping of non-ASCII characters in `.properties` translation files
* Changes on files with `.less` extension triggers a theme build and delivers the compiled CSS files.
* Version info is created automatically (`/resources/sap-ui-version.json`).
* List project files with URL (needed exclusively by the OpenUI5 [testsuite](https://github.com/SAP/openui5/tree/master/src/testsuite)): `/discovery/app_pages`, `/discovery/all_libs`, `/discovery/all_tests`

## Certificates for HTTPS or HTTP/2
When using the UI5 Server with the UI5 CLI, SSL certificates for HTTPS and HTTP/2 configurations can automatically be generated.

**Hint:** If Chrome unintentionally redirects a HTTP-URL to HTTPS, you need to delete the HSTS mapping in [chrome://net-internals/#hsts](chrome://net-internals/#hsts) by entering the domain name (e.g. localhost) and pressing "delete".
