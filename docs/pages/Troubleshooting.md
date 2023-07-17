# Troubleshooting
## UI5 Server
### Chrome Redirects HTTP URLs to HTTPS (`ERR_SSL_PROTOCOL_ERROR`)
An HTTPS server or proxy that was previously running on a domain (e.g. `localhost`), might have set an HSTS header, enforcing Chrome to always use HTTPS for this domain. See https://www.chromium.org/hsts. This makes it impossible to connect to an HTTP-only server running on the same domain.

#### Resolution
You need to delete the HSTS mapping in [chrome://net-internals/#hsts](chrome://net-internals/#hsts) by entering the domain name (e.g. `localhost`) and pressing "delete".

## Issues Not Listed Here
Please follow our [Contribution Guidelines](https://github.com/SAP/ui5-tooling/blob/main/CONTRIBUTING.md#report-an-issue) on how to report an issue.

## UI5 Project
### `~/.ui5` Taking too Much Disk Space

There are possibly many versions of UI5 framework dependencies installed on your system, taking a large amount of disk space.

#### Resolution

Remove the `.ui5/framework/` directory from your user's home directory:

```sh
rm -rf ~/.ui5/framework/
```

Any missing framework dependencies will be downloaded again during the next UI5 Tooling invocation.

## UI5 CLI
### Changing the Log Level via Environment Variable

In CI environments or in a combination with other tools, the usage of [UI5 CLI's `--log-level`](https://sap.github.io/ui5-tooling/stable/pages/CLI/#common-options) command parameter might be inconvenient and even impossible.

#### Resolution

Replace UI5 Tooling's `--log-level` option with the `UI5_LOG_LVL` environment variable.

For example:

`UI5_LOG_LVL=silly ui5 build`

on Windows:

`set UI5_LOG_LVL=silly ui5 build`

**Note**: Combination of `UI5_LOG_LVL` & `--log-level` CLI parameter might lead to unexpected results. They should be used interchangeably, but not together. The CLI parameter has precedence over `UI5_LOG_LVL` env variable.