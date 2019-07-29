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

Properties files (`*.properties`) should be allowed to use UTF-8 encoding, in addition to ISO-8859-1 (default).
When building projects or serving files, the output file content should be independent of encodings (plain ASCII) to prevent issues with different encoding expectations/limitations of other tools or servers.

## Motivation

The i18n source files in UI5 are expected to be encoded in ISO-8859-1, based on the [Java 8 properties files](https://docs.oracle.com/javase/8/docs/api/java/util/Properties.html).
This is also part of the [UI5 Development Conventions and Guidelines](https://ui5.sap.com/#/topic/753b32617807462d9af483a437874b36).

Properties files encoded with UTF-8 are causing issues with non-ASCII characters, as a different encoding is expected.

But as UTF-8 is the default encoding for most of the programs and tools nowadays, this is quite cumbersome. Some editors don't even easily support reading from or writing to other encodings and expect UTF-8 by default.
Also with Java 9 the default encoding for properties files has been changed to UTF-8 ([JEP 226: UTF-8 Property Resource Bundles](http://openjdk.java.net/jeps/226)).

A workaround to this problem is to use unicode escape sequences (`\uXXXX`) which makes the content independent from the encoding but very cumbersome to maintain without additional tools to convert the file.
This escaping solution is already used for most of the UI5 libraries, especially for locales which require unicode characters not supported in ISO-8859-1.

To improve the overall developer experience and to prevent encoding issues, the UI5 Tooling should be enhanced to also support properties files encoded in UTF-8.
But as there are existing tools and server middleware which explicitly expect those files to be encoded in ISO-8859-1, the output of the UI5 Tooling needs to be independent of the encoding (plain ASCII). This should be achieved by converting non-ASCII characters to unicode escape sequences (`\uXXXX`), as already mentioned above.

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
It should use a processor called `nonAsciiEscaper` which escapes non ASCII characters (characters which are not within the 128 character ASCII range) within a given string.
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
This ensures that the properties files can always be consumed independent of the source encoding.
Each build output should contain the escaped properties files.
This ensures that all `properties` contain only ASCII characters such that they can be consumed by other platforms.

The new standard task should automatically be integrated into the build process and the underlaying processor can be reused by the `ui5-server`.

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
