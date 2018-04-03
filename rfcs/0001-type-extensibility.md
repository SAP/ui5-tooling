- Start Date: 2018-04-03
- RFC PR: [#4](https://github.com/SAP/ui5-tooling/pull/4)
- Issue: -
- Affected components
    + [x] [ui5-builder](https://github.com/SAP/ui5-builder)
    + [ ] [ui5-server](https://github.com/SAP/ui5-server)
    + [ ] [ui5-cli](https://github.com/SAP/ui5-cli)
    + [ ] [ui5-fs](https://github.com/SAP/ui5-fs)
    + [x] [ui5-project](https://github.com/SAP/ui5-project)
    + [ ] [ui5-logger](https://github.com/SAP/ui5-logger)

# RFC 0001 Type Extensibility
## Summary
Add a feature to customize how a specific UI5 project is being built.

## Motivation
Currently the UI5 build is only capable of building UI5 projects of types "application" and "library" with a fixed set of tasks it executes.

A UI5 project (for example a library) may want to add or modify build steps (for example execute custom bundling). For this, an extensibility mechanism is needed.

Multiple UI5 projects may require the same kind of "customized" build. Therefore reuse should be possible.

## Detailed design
### Extensibility of types
Leverage the existing mechanism of types (currently for application and library), allow for a custom type and do the necessary adaption via regular JS language features (i.e. object-orientation, deriving and overriding).

The `AbstractBuilder` (as well as any subclass-implementation) offers a set of functions which can be overwritten.

#### Combined list of tasks executed by application- and library types
- replaceCopyright
- replaceVersion
- buildThemes
- generateLibraryPreload
- createDebugFiles
- uglify
- generateFlexChangesBundle
- generateManifestBundle
- generateAppPreload
- generateStandaloneAppBundle
- generateVersionInfo

#### Functions of the `AbstractBuilder` ("Phases")
1. preprocess()
    - replaceCopyright
    - replaceVersion
1. process()
    - createDebugFiles()
    - buildThemes()
1. bundle()
1. postprocess() / optimize()
    - uglify()

A custom types `Builder` module shall extend another types builder or the generic `AbstractBuilder`:
```js
class MyCustomBuilder extends AbstractBuilder {
    bundle() {
        super.bundle();
        myCustomBundle();
    }
}
```

### Collecting and applying type extensions

## How we teach this
TBD

## Drawbacks
TBD

## Alternatives
There are ways to consume (and thereby possibly adapt) the existing tooling through its API via taskrunners such as grunt or gulp, or using a custom node.js script. But this offers only limited possibilities, especially when it comes to building transient dependencies.

## Unresolved questions
