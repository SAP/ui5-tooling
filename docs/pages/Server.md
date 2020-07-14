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

**Hint:** If Chrome unintentionally redirects an HTTP-URL to HTTPS, you need to delete the HSTS mapping in [chrome://net-internals/#hsts](chrome://net-internals/#hsts) by entering the domain name (e.g. localhost) and pressing "delete".

## CSP Reporting
The support of a Content Security Policy ([CSP](https://www.w3.org/TR/CSP/)) is active by default.
The header `content-security-policy` can be set by adding URL parameter `sap-ui-xx-csp-policy` to the request with the policy name as value.
To set the policy to report-only, append `:report-only` or `:ro` to the policy name.
E.g. `/index.html?sap-ui-xx-csp-policy=sap-target-level-1:report-only`

### SAP target CSP
The default CSP policies can be modified using parameter `sendSAPTargetCSP` (`--sap-csp-policies` when using the CLI).
With `sendSAPTargetCSP` set to `true` the policies `sap-target-level-1` and `sap-target-level-2` policies are activated and send as report-only.

### Serve CSP Reports

!!! info
    This option is available since UI5 CLI [`v2.3.0`](https://github.com/SAP/ui5-cli/releases/tag/v2.3.0)
    
Serving of CSP reports can be activated with parameter `serveCSPReports` (`--serve-csp-reports` when using the CLI).
With `serveCSPReports` set to `true`, the CSP reports are collected and can be downloaded from the server path `/.ui5/csp/csp-reports.json`.