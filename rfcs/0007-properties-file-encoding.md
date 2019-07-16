# RFC 0007 Properties File Encoding

- Start Date: 2019-07-15
- RFC PR: [#168](https://github.com/SAP/ui5-tooling/pull/168)
- Issue: [#161](https://github.com/SAP/ui5-tooling/issues/161)
- Affected components
  - [x] [ui5-builder](https://github.com/SAP/ui5-builder)
  - [x] [ui5-server](https://github.com/SAP/ui5-server)
  - [ ] [ui5-cli](https://github.com/SAP/ui5-cli)
  - [ ] [ui5-fs](https://github.com/SAP/ui5-fs)
  - [ ] [ui5-project](https://github.com/SAP/ui5-project)
  - [ ] [ui5-logger](https://github.com/SAP/ui5-logger)

## Summary

Properties files (`*.properties`) should be encoded in pure ASCII when serving them via the `ui5-server` or building an application/library with the `ui5-builder`.

## Motivation

Currently the properties files are mostly encoded in ISO-8859-1 (which is used by most existing SAP server platforms).
By default the files are served as UTF-8 by the `ui5-server`. This will lead to the problem that special characters are not displayed correctly.
The user wants to be able to use properties files with ISO-8859-1 encoding. Additionally the user wants have the option to specify the encoding.

## Detailed design

### Configuration

A configuration for the `ui5-builder` tasks and the `ui5-server` should be provided such that the source encoding can be specified.

There should be 2 options:

- `ISO-8859-1` (non ASCII characters will be escaped with the unicode sequence `\uXXXX`)
- `UTF-8` (no character escaping will take place)

The default is `ISO-8859-1` for compatibility reasons.

Umlaut Example:

| Umlaut   | UTF-8              |
|----------|--------------------|
| `Ä`, `ä` | `\u00c4`, `\u00e4` |
| `Ö`, `ö` | `\u00d6`, `\u00f6` |
| `Ü`, `ü` | `\u00dc`, `\u00fc` |
| `ß`      | `\u00df`          |

This should be configured within the `ui5.yaml` file.

Example:

```yaml
specVersion: "1.0"
type: application
metadata:
  name: my.application
resources:
  propertiesFileEncoding: "UTF-8"
```

The resources section within the configuration can be consumed by `ui5-builder` and `ui5-server`.

### Build Task

The `ui5-builder` should offer a new standard task called `escapeNonAsciiCharacters` which escapes all special characters in unicode using the unicode escape sequence `\uXXXX`.
It should use a processor called `stringEscaper` which escapes special characters in files and is used within the task to operate only on `*.properties` files.
The task should be run first (before `replaceCopyright`) for all types.
This ensures that the properties files can always be consumed.
Each build output should contain then the escaped properties files.
This ensures taht the now purely ASCII based `*.properties` files can be used on other platforms too.

The new standard task should automatically be integrated into the build process and can be reused by the server.

### Server part

Currently the `ui5-server` serves all resources as UTF-8.

The `ui5-server` should offer the capability to re-use the `ui5-builder` processor `stringEscaper` to also escape characters while serving `*.properties`.
Due to the pure ASCII representation now, the served content can always be interpreted and properly consumed as UTF-8.

Technically, there should be a special treatment in [serveResources](https://github.com/SAP/ui5-server/blob/master/lib/middleware/serveResources.js#L42) middleware which uses the configuration and the processor to serve properties files such that they can be interpreted as UTF-8 encoded files.

## How we teach this

- Documentation about how to specify the properties files encoding option
- Explanation of the Escaping with examples

## Drawbacks

## Alternatives

- Check the file contents and guess its encoding
  - Use response content-type header attribute
  - Only escape if the file encoding and the transport encoding do not match, e.g. file is encoded as `ISO-8859-1` but will be served as `UTF-8`

## Unresolved Questions and Bikeshedding
