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
By default the files are served as UTF-8 by the `ui5-server`. This will lead to the problem that special characters are not displayed correctly because they are read using UTF-8 encoding.
The user wants to be able to use properties files with ISO-8859-1 encoding. Additionally the user wants have the option to specify UTF-8 encoding 
e.g. if a properties file contains special characters which are not present in ISO-8859-1.

## Detailed design

### Configuration

A configuration for the `ui5-builder` tasks and the `ui5-server` should be provided such that the source encoding of `*.properties` files can be specified.

Encodings should be supported according to the [Encoding spec](https://encoding.spec.whatwg.org/).
For more information check out: [Buffers and Character Encodings](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings)

Supported values are: `UTF-8` and `ISO-8859-1`

The default is `ISO-8859-1` for compatibility reasons (set by the formatters).

This should be configured within the `ui5.yaml` file.

Example:

```yaml
specVersion: "1.0"
type: application
metadata:
  name: my.application
resources:
  configuration:
    propertiesFileSourceEncoding: "UTF-8"
```

The resources section within the configuration can be consumed by `ui5-builder` and `ui5-server`.

### Build Task

The `ui5-builder` should offer a new standard task called `escapeNonAsciiCharacters` which escapes all special characters in unicode using the unicode escape sequence `\uXXXX`.
It should use a processor called `nonAsciiEscaper` which escapes non ascii characters (characters which are not within the 128 character ASCII range) within a given string.
The processor `nonAsciiEscaper` should offer an encoding parameter and a method which provides valid values for this option (`nonAsciiEscaper#getEncodingFromAlias`).


Umlaut Example:

| Umlaut   | UTF-8              |
|----------|--------------------|
| `Ä`, `ä` | `\u00c4`, `\u00e4` |
| `Ö`, `ö` | `\u00d6`, `\u00f6` |
| `Ü`, `ü` | `\u00dc`, `\u00fc` |
| `ß`      | `\u00df`           |

The task operates on `*.properties` files using the processor.
The task should run first (before `replaceCopyright`) for all types.
This ensures that the properties files can always be consumed.
Each build output should contain the escaped properties files.
This ensures that all `properties` contain only ASCII characters such that they can be consumed by other platforms.

The new standard task should automatically be integrated into the build process and can be reused by the `ui5-server`.

### Server part

The `ui5-server` should serve all resources using `UTF-8` [charset header](https://www.w3.org/International/articles/http-charset/index.en).

The `ui5-server` should offer the capability to re-use the `ui5-builder` processor `nonAsciiEscaper` to escape characters in `*.properties` files.
Due to the pure ASCII representation now, the served content can always be interpreted and properly consumed as UTF-8.

Technically, there should be a special treatment in [serveResources](https://github.com/SAP/ui5-server/blob/master/lib/middleware/serveResources.js#L42) middleware which uses the configuration and the processor to serve properties files such that they can be interpreted as `UTF-8` encoded content.

## How we teach this

- Documentation about how to specify the properties files encoding option
- Explanation of the Escaping with examples

## Drawbacks

## Alternatives

- Check the file contents and guess its encoding
  - Use response content-type header attribute
  - Only escape if the file encoding and the transport encoding do not match, e.g. file is encoded as `ISO-8859-1` but will be served as `UTF-8`

## Unresolved Questions and Bikeshedding
