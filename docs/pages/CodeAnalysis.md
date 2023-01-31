# Code Analysis

During the build process, UI5 Tooling executes a static code analysis of a project. In this and following sections the term "Simple Literial" is used. "Simple Literial" means following language fetaures:

- String Literal
- Numeric Literal
- Boolean Literal
- `null` / `undefined`
- Template Literal without any expression
- Arrays of the previous, spread operators will be ignored (not taken into account)
- Object Literals with "Simple Literals" as keys and values (again, spread operators will be ignored / not taken into account)

## Dependency Analysis

UI5 Tooling extracts dependency information from a project's code as outlined in the following chapters.
The APIs described in the following sections requiring the usage of "Simple Literals" when declaring dependencies.

### JSModule Analyzer

Following APIs are analyzed by the JSModule Analyzer:

- sap.ui.define
- sap.ui.require
- jQuery.sap.declare (deprecated)
- jQuery.sap.require (deprecated)
- sap.ui.requireSync (deprecated)
- sap.ui.preload (restricted)
- sap.ui.require.preload (restricted)

The [JSModule Analyzer](https://github.com/SAP/ui5-builder/blob/main/lib/lbt/analyzer/JSModuleAnalyzer.js) uses the ["Abstract Syntax Tree"](https://en.wikipedia.org/wiki/Abstract_syntax_tree) (AST) of a JavaScript file to decide whether a code block is executed *conditionally* or *unconditionally*.

The analyzer uses a set of rules to decide whether one of the above APIs is immediately called when the module is executed or whether the API is only called under certain conditions.

For example, top-level code is always executed. Flow-control statements in JavaScript imply that certain blocks of code are only executed under certain conditions (e.g. if block, else block, ...). Besides those inherent JavaScript rules, further common patterns are known to the analyzer, e.g. immediately invoked function expressions or the factor function of AMD modules.

Any dependencies that are found in code that - according to those rules - is always executed, are collected as eager (or standard) dependencies. Dependencies that are found on a code path that depends on certain conditions are collected as conditional dependencies.

The bundling implemented by the UI5 tooling can either follow only eager dependencies (resolve:`true`) or also conditional dependencies (resolveConditional). For further information see [Custom Bundling](https://sap.github.io/ui5-tooling/v3/pages/Configuration/#custom-bundling).

When a dependency in one of the mentioned APIs is not a "Simple Literal" but an expression, the corresponding module is marked as "having dynamic dependencies". This marker is currently not further evaluated by the tooling.

### Component Analyzer

The [Component Analyzer](https://github.com/SAP/ui5-builder/blob/main/lib/lbt/analyzer/ComponentAnalyzer.js) analyzes JavaScript files named `Component.js` to collect dependency information by searching for a `manifest.json` in the same folder. If one is found, the `sap.ui5` section will be evaluated in the following way

- any library dependency is added as a dependency to the `library.js` module of that library. If the library dependency is modeled as 'lazy', the
 module dependency will be added as 'conditional'
- any component dependency is added as a dependency to a file named `Component.js`. If the dependency is modeled as 'lazy', the module dependency will be added as 'conditional'
- for each configured UI5 model, for which a type is configured, a module dependency to that type is added
- for each route that contains a view name, a module dependency to that view will be added

### Fiori Elements Analyzer

The [Fiori Elements Analyzer](https://github.com/SAP/ui5-builder/blob/main/lib/lbt/analyzer/FioriElementsAnalyzer.js) analyzes a FioriElements app and its underlying template components to collect dependency information. It searches for a `manifest.json` in the same folder. If one is found the `sap.fe` section will be evaluated in the following way:

- for each entity set in the `entitySets` object, each sub-entry is checked for a `default.template` property
- if found, the containing string is interpreted as the short name of a template component in the `sap.fe.templates` library
- a dependency to that template component is added to the analyzed app

For a full analysis, "routing" also should be taken into account. Only when a sub-entry of the entity set
is referenced by a route, then the template for that entry will be used. Routes thereby could form entry points.

```json
{
    "sap.fe" : {
        "entitySets" : {
            "C_AIVS_MDBU_ArtistTP" : {
                "feed": {
                    "default": {
                        "template": "ListReport"
                    }
                },
                "entry" : {
                    "default" : {
                        "outbound" : "musicV2Display"
                    }
                }
            }
        },
        "routing" : {
            "routes" :{
                "ArtistList": {
                    "target": "C_AIVS_MDBU_ArtistTP/feed"
                }
            }
        }
    }
}
```

The template component is analyzed in the following way:

- precondition: template component class is defined in an AMD-style module, using define or sap.ui.define
- precondition: the module 'sap/fe/core/TemplateAssembler' is imported
- precondition: a call to TemplateAssembler.getTemplateComponent is used to define the component class
- precondition: that call is used in a top level return statement of the factory function
- precondition: necessary parameters to that call are given as an object literal (no further coding)
- precondition: the settings define a managed property property 'metadata.properties.templateName' with a
                defaultValue of type string
The default value of the property represents the template view of the template component.
The manifest of the template app in theory could specify an alternative template as setting.templateName,
but as of June 2017, this possibility is currently not used.

### Smart Template Analyzer

The [Smart Template Analyzer](https://github.com/SAP/ui5-builder/blob/main/lib/lbt/analyzer/SmartTemplateAnalyzer.js) analyzes a Smart Template app and its underlying template components to collect dependency information. It searches for a `manifest.json` in the same folder. If it is found and if it is a valid JSON, an "sap.ui.generic.app" section is searched and evaluated in the following way

- for each page configuration, the configured component is added as a dependency to the template app module
- if the page configuration contains a templateName, a dependency to that template view is added to the app
- otherwise, the class definition of the component is analyzed to find a default template view name. if found, a dependency to that view is added to the app module

The template component is analyzed in the following way:

- precondition: template component class is defined in an AMD-style module, using define or sap.ui.define
- precondition: the module 'sap/suite/ui/generic/template/lib/TemplateAssembler' is imported
- precondition: a call to TemplateAssembler.getTemplateComponent is used to define the component class
- precondition: that call is used in a top level return statement of the factory function
- precondition: necessary parameters to that call are given as an object literal (no further coding)
- precondition: the settings define a managed property property 'metadata.properties.templateName' with a defaultValue of type string
The default value of the property represents the template view of the template component.
The manifest of the template app in theory could specify an alternative template in
component.settings.templateName.

### XML Template Analyzer

The [XML Template Analyzer](https://github.com/SAP/ui5-builder/blob/main/lib/lbt/analyzer/XMLTemplateAnalyzer.js) tackles XMLViews and XMLFragments. It parses the XML, collects controls and adds them as dependency to the ModuleInfo object.
Additionally, some special dependencies are handled:

- controller of the view
- resource bundle (note: as locale dependent dependencies can't be modelled yet in the ModuleInfo, only a dependency to the development version (aka raw language) of the bundle will be added)
- component referenced via ComponentContainer control
- embedded fragments or views

In an XMLView/XMLFragment, there usually exist 3 categories of element nodes: controls, aggregations and non-UI5 nodes (e.g. XHTML or SVG).

### XML Composite Analyzer

The **XMLComposite** control is deprecated since UI5 Version 1.88. Nevertheless UI5 Tooling will attempt to analyze the declaration of any such controls in a project. The [XML Composite Analyzer](https://github.com/SAP/ui5-builder/blob/main/lib/lbt/analyzer/XMLCompositeAnalyzer.js) searches for the name of the configured fragment containing the **XMLComposite** control.

=== "Name of the XMLComposite is equal with fragment name"

    ```javascript hl_lines="4"
    sap.ui.define([
        "sap/ui/core/XMLComposite"
    ], function(XMLComposite) {
        return XMLComposite.extend("composites.MyComposite", {} 
    });
    ```

=== "Dedicated fragment name"

    ```javascript hl_lines="5"
    sap.ui.define([
        "sap/ui/core/XMLComposite"
    ], function(XMLComposite) {
        return XMLComposite.extend("composites.MyComposite", {
            fragment: "composites.custom.MyComposite"
        } 
    });
    ```

## Library Initialization

The [library.js Analyzer](https://github.com/SAP/ui5-builder/blob/main/lib/lbt/analyzer/analyzeLibraryJS.js) checks every `library.js` file in the namespace of a library for occurences of a `sap/ui/core/Core#initLibrary` call. If so, the following information will be placed in the generated manifest.json:

- noLibraryCSS: false when the noLibraryCSS property had been set in the initLibrary info object
- types: string array with the names of the types contained in the library
- controls: string array with the names of the controls defined in the library
- elements: string array with the names of the elements defined in the library
- interfaces: string array with the names of the interfaces defined in the library

When using `sap/ui/core/Core#initLibrary` requires the usage of "Simple Literals" for the parameter passed to this function call.

Note: currently only the usage via the global `sap.ui.getCore().initLibrary` is supported by this analyzer. Requiring the `sap/ui/core/Core` and then call `Core.initLibrary` is not recognized by this analyzer.

## JSDoc

The UI5 Tooling offers a JSDoc build, which is enhanced by UI5 specific JSDoc features.

An UI5 SDK can be build locally. To get more insights about the local UI5 SDK build setup, have a look at the [Developer Guide](https://github.com/SAP/openui5/blob/master/docs/developing.md#building-the-openui5-sdk-demo-kit).

Currently, the resources needed for a UI5 SDK build are stored in [openui5](https://github.com/SAP/openui5/tree/master/lib/jsdoc) and in [ui5-builder](https://github.com/SAP/ui5-builder/blob/main/lib/processors/jsdoc). This double maintenance is needed because these files are not part of the `sap.ui.core` library artefact, so building JSDoc for any library has no access to the needed resources. Therefore it is necessary to have these resources also available in the *ui5-builder*. This might change in future.

Following artefacts contributing to the JSDoc build:

- [jsdocGenerator.js](https://github.com/SAP/ui5-builder/blob/main/lib/processors/jsdoc/jsdocGenerator.js):
  Executes the actual JSDoc build. UI5 Tooling wrapper for `plugin.cjs`.
- [sdkTransformer.js](https://github.com/SAP/ui5-builder/blob/main/lib/processors/jsdoc/sdkTransformer.js):
  UI5 Tooling wrapper for `transformApiJson.cjs`.
- [apiIndexGenerator.js](https://github.com/SAP/ui5-builder/blob/main/lib/processors/jsdoc/apiIndexGenerator.js):
  UI5 Tooling wrapper for `createIndexFiles.cjs`.
- [createIndexFiles.cjs](https://github.com/SAP/ui5-builder/blob/main/lib/processors/jsdoc/lib/createIndexFiles.cjs):
  Creates API index resources from all `api.json` resources and by interpreting the `sap-ui-version.json` available in the given test resources directory. The resulting index resources (e.g. `api-index.json`,  `api-index-deprecated.json`,
  `api-index-experimental.json` and `api-index-since.json`) are only to be used in a UI5 SDK.
- [transformApiJson.cjs](https://github.com/SAP/ui5-builder/blob/main/lib/processors/jsdoc/lib/transformApiJson.cjs): 
  Preprocesses `api.json` files for use in a UI5 SDKs. Transforms the `api.json` as created by the JSDoc build into a pre-processed `api.json` file suitable for the SDK. The pre-processing includes formatting of type references, rewriting of links and other time consuming calculations.
- [plugin.cjs](https://github.com/SAP/ui5-builder/blob/main/lib/processors/jsdoc/lib/ui5/plugin.cjs):
  UI5 plugin for JSDoc3. The plugin adds the following UI5 specific tag definitions to JSDoc3.

    - disclaimer
    - experimental
    - final
    - interface
    - implements
	- ui5-restricted and more

    It furthermore listens to the following JSDoc3 events to implement additional functionality

    - parseBegin: to create short names for all file that are to be parsed
    - fileBegin: to write some line to the log (kind of a progress indicator)
    - jsdocCommentFound: to pre-process comments, empty lines are used as paragraph markers a default visibility is added, legacy tag combinations used in JSdoc2 are converted to JSDoc3 conventions
    - newDoclet
    - parseComplete: remove undocumented/ignored/private doclets or duplicate doclets

    Last but not least, it implements an astNodeVisitor to detect UI5 specific "extend" calls and to create documentation for the properties, aggregations etc. that are created with the "extend" call.

- [publish.cjs](https://github.com/SAP/ui5-builder/blob/main/lib/processors/jsdoc/lib/ui5/template/publish.cjs): JSDoc3 template for UI5 documentation generation.

    - adds missing namespaces
    - determines the exports names of exported APIs
    - writes out the `api.json` from the collected JSDoc information
	- calculates the inheritance hierarchy
	- checks for cyclic dependencies
	- removes unnecessary whitespace from an HTML document

- [versionUtil.cjs](https://github.com/SAP/ui5-builder/blob/main/lib/processors/jsdoc/lib/ui5/template/utils/versionUtil.cjs): Provides helper methods to determine version related information.
