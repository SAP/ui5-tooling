
# ECMAScript Support

UI5 Tooling offers general support for `ES2022` ECMAScript features. While a `ui5 build` is executed, UI5 Tooling analyses a project's code. Depending on the project type, you have to consider some restrictions regarding the used of certain ECMAScript syntax.

| UI5 Tooling Version | Supported ECMAScript Version | Note |
|-------------------- |----------------------------- | ---- |
| v3.0+               | ECMAScript 2022              |      |
| v2.0+               | ECMAScript 2009/ES5          | Note that code up to ECMAScript 2020 can be parsed, however required code analysis might not work correctly for specific language features |

In section [Language Features with Limitations](#language-features-with-limitations) all limitations grouped by the kind of ECMAScript artefact are described. In section [Code Analyzing](#code-analyzing) there is a more detailed explaination what kind of code analysis is done by the UI5 Tooling.

## Language Features with Limitations

The following sections describe the limitations grouped by the ECMAScript language feature.

### JavaScript modules

In general, UI5 Tooling only analyzes **JavaScript** files of type `script`. [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) are not analyzed.

UI5 Tooling and the UI5 Runtime does not support the usage of `export` and `import` of JavaScript Modules. Therefore, `sap.ui.define` has to be used.

=== "Supported"

    ```javascript
    sap.ui.define([
        "ModuleA",
        "ModuleB"
    ], function(ModuleA, ModuleB) {
        return ModuleA.extend("ModuleC", {});
    });
    ```

=== "Not Supported"

    ```javascript hl_lines="1 2 3"
    import ModuleA from "ModuleA";
    import ModuleB from "ModuleB";
    export default class ModuleC extends ModuleA {};
    ```

### Template Literal

[Template Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) without an expressions can be used in all places where string literals can be used. However, since UI5 Tooling will attempt a static code analysis for certain calls to UI5 API, Template Literals with one or more expressions (e.g. `Hello ${planets[2]}`) can't be used in the scenarios described below.

#### Template Literal in `sap.ui.define` or `sap.ui.require`

Template Literals with one or more expressions inside a `sap.ui.define` or `sap.ui.require` call are not supported.

=== "Supported"

    ```javascript
    sap.ui.define([
        `ModuleA`,
        `ModuleB`
    ], function(ModuleA, ModuleB) {
    });
    ```

=== "Not Supported"

    ```javascript hl_lines="4"
    const i = `B`;
    sap.ui.define([
        `ModuleA`,
        `Module${i}`
    ], function(ModuleA, ModuleB) {
    });
    ```

The same rule applies also for the usage of deprecated or no longer recommended APIs `jQuery.sap.declare`, `jQuery.sap.declare`, `define`, `require`, `require.predefine`, `sap.ui.predefine`, `sap.ui.requireSync` and `sap.ui.require.preload`.

#### Template Literal in Fiori Elements Template Declaration

When declaring a **Fiori Elements Template** using a **Template Literal** with one or more expressions in the name of the **Fiori Elements Template** is not supported.

=== "Supported"

    ```javascript
    sap.ui.define([
        `sap/fe/core/TemplateAssembler`
    ], function(TemplateAssembler) {
        return TemplateAssembler.getTemplateComponent(getMethods, 
            `sap.fe.templates.Page.Component`, {
                metadata: {
                    properties: {
                        templateName: {
                            type: `string`,
                            defaultValue: `sap.fe.templates.Page.view.Page`
                        }
                    },
                    manifest: `json`
                }
            }
        );
    });
    ```

=== "Not Supported"

    ```javascript hl_lines="6"
    sap.ui.define([
        `sap/fe/core/TemplateAssembler`
    ], function(TemplateAssembler) {
        const name = `Component`;
        return TemplateAssembler.getTemplateComponent(getMethods,
            `sap.fe.templates.Page.${name}`, {
                metadata: {
                    properties: {
                        templateName: {
                            type: `string`,
                            defaultValue: `sap.fe.templates.Page.view.Page`
                        }
                    },
                    manifest: `json`
                }
            }
        );
    });
    ```

#### Template Literal in Smart Template Declaration

When declaring a **Smart Template** using a **Template Literal** with one or more expressions in the name of the **Smart Template** is not supported.

=== "Supported"

    ```javascript
    sap.ui.define([
        `sap/suite/ui/generic/template/lib/TemplateAssembler`
    ], function(TemplateAssembler) {
        return TemplateAssembler.getTemplateComponent(getMethods, 
            `sap.suite.ui.generic.templates.Page.Component`, {
                metadata: {
                    properties: {
                        templateName: {
                            type: `string`,
                            defaultValue: `sap.suite.ui.generic.templates.Page.view.Page`
                        }
                    },
                    manifest: `json`
                }
            }
        );
    });
    ```

=== "Not Supported"

    ```javascript hl_lines="6"
    sap.ui.define([
        `sap/suite/ui/generic/template/lib/TemplateAssembler`
    ], function(TemplateAssembler) {
        const name = `Component`;
        return TemplateAssembler.getTemplateComponent(getMethods,
            `sap.suite.ui.generic.templates.Page.${name}`, {
                metadata: {
                    properties: {
                        templateName: {
                            type: `string`,
                            defaultValue: `sap.suite.ui.generic.templates.Page.view.Page`
                        }
                    },
                    manifest: `json`
                }
            }
        );
    });
    ```

#### Template Literal in XMLComposite Declaration

The **XMLComposite** control is deprecated since UI5 Version 1.88. Nevertheless UI5 Tooling will attempt to analyze the declaration of any such controls in a project.

Declaring an **XMLComposite** control using a **Template Literal** with one or more expressions in the name, is not supported.

=== "Supported"

    ```javascript
    sap.ui.define([
        `sap/ui/core/XMLComposite`
    ], function(XMLComposite) {
        return XMLComposite.extend(`composites.MyComposite`, {} 
    });
    ```

=== "Not Supported"

    ```javascript hl_lines="5"
    sap.ui.define([
        `sap/ui/core/XMLComposite`
    ], function(XMLComposite) {
        const name = `MyComposite`;
        return XMLComposite.extend(`composites.${name}`, {});
    });
    ```

#### Template Literal in sap/ui/core/Core#initLibrary Call

A library is typically initialized via an accompanying `library.js`. Within that file, the object which is supplied to the `sap/ui/core/Core#initLibrary` method, must not use a **Template Literal** with one or more expressions for the library name.

=== "Supported"

    ```javascript
    sap.ui.getCore().initLibrary({
        name: `my.lib`
    });
    ```

=== "Not Supported"

    ```javascript hl_lines="3"
    const libraryName = `lib`;
    sap.ui.getCore().initLibrary({
        name: `my.${libraryName}`
    });
    ```

### Spread Element

A [Spread Element](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) can be used in all places, except the following.

#### Spread Element in `sap.ui.define` or `sap.ui.require`

A **Spread Element** as a parameter in a `sap.ui.define` or `sap.ui.require` call is not supported.

=== "Supported"

    ```javascript
    sap.ui.define([
        "ModuleA",
        "ModuleB"
    ], function(ModuleA, ModuleB) {
    });
    ```

=== "Not Supported"

    ```javascript hl_lines="3"
    const dependencies = ["ModuleA", "ModuleB"];
    sap.ui.define([
        ...dependencies
    ], function(ModuleA, ModuleB) {
    });
    ```

The same rule applies also for the usage of deprecated or no longer recommended APIs `jQuery.sap.declare`, `jQuery.sap.declare`, `define`, `require`, `require.predefine`, `sap.ui.predefine`, `sap.ui.requireSync` and `sap.ui.require.preload`.

#### Spread Element in Fiori Elements Template Declaration

When declaring a **Fiori Elements Template**, the usage of a **Spread Element** in the configuration is not supported.

=== "Supported"

    ```javascript
    sap.ui.define([
        "sap/fe/core/TemplateAssembler"
    ], function(TemplateAssembler) {
        return TemplateAssembler.getTemplateComponent(getMethods, 
            "sap.fe.templates.Page.Component", {
                metadata: {
                    properties: {
                        templateName: {
                            type: "string",
                            defaultValue: "sap.fe.templates.Page.view.Page"
                        }
                    },
                    manifest: "json"
                }
            }
        );
    });
    ```

=== "Not Supported"

    ```javascript hl_lines="14"
    sap.ui.define([
        "sap/fe/core/TemplateAssembler"
    ], function(TemplateAssembler) {
        const myTemplate = {
            templateName: {
                type: "string",
                defaultValue: "sap.fe.templates.Page.view.Page"
            }
        };
        return TemplateAssembler.getTemplateComponent(getMethods,
            "sap.fe.templates.Page.Component", {
                metadata: {
                    properties: {
                        ...myTemplate
                    },
                    manifest: "json"
                }
            }
        );
    });
    ```

#### Spread Element in Smart Template Declaration

When declaring a **Smart Template**, the usage of a **Spread Element** in the configuration is not supported.

=== "Supported"

    ```javascript
    sap.ui.define([
        "sap/suite/ui/generic/template/lib/TemplateAssembler"
    ], function(TemplateAssembler) {
        return TemplateAssembler.getTemplateComponent(getMethods, 
            "sap.suite.ui.generic.templates.Page.Component", {
                metadata: {
                    properties: {
                        templateName: {
                            type: "string",
                            defaultValue: "sap.suite.ui.generic.templates.Page.view.Page"
                        }
                    },
                    manifest: "json"
                }
            }
        );
    });
    ```

=== "Not Supported"

    ```javascript hl_lines="6"
    sap.ui.define([
        "sap/suite/ui/generic/template/lib/TemplateAssembler"
    ], function(TemplateAssembler) {
        const myTemplate = {
            templateName: {
                type: "string",
                defaultValue: "sap.suite.ui.generic.templates.Page.view.Page"
            }
        };
        return TemplateAssembler.getTemplateComponent(getMethods,
            "sap.suite.ui.generic.templates.Page.Component", {
                metadata: {
                    properties: {
                        ...myTemplate
                    }
                    manifest: "json"
                }
            }
        );
    });
    ```

#### Spread Element in XMLComposite Declaration

When declaring an **XMLComposite**, the usage of a **Spread Element** in the configuration is not supported.

=== "Supported"

    ```javascript
    sap.ui.define([
        "sap/ui/core/XMLComposite"
    ], function(XMLComposite) {
        return XMLComposite.extend("composites.MyComposite", {
            fragment: "composites.custom.MyComposite"
        } 
    });
    ```

=== "Not Supported"

    ```javascript hl_lines="5"
    sap.ui.define([
        "sap/ui/core/XMLComposite"
    ], function(XMLComposite) {
        const myXMLComposite = {
              fragment: "composites.custom.MyComposite"
        };
        return XMLComposite.extend(`composites.MyComposite`, {
            ...myXMLComposite
        });
    });
    ```

#### Spread Element in sap/ui/core/Core#initLibrary Call

A library is typically initialized via an accompanying `library.js`. Within that file, the object which is supplied to the `sap/ui/core/Core#initLibrary` method, must not use a **Spread Element**.

=== "Supported"

    ```javascript
    sap.ui.getCore().initLibrary({
        name: "my.lib"
    });
    ```

=== "Not Supported"

    ```javascript hl_lines="5"
    const mylib = {
        name: "my.lib"
    };
    sap.ui.getCore().initLibrary({
        ...mylib
    });
    ```

### Object Expression

An **Object Expression** can be used in all places except in following places.

#### Object Expression in `sap.ui.define` or `sap.ui.require`

An **Object Expression** as a parameter in a `sap.ui.define` or `sap.ui.require` call is not supported.

=== "Supported"

    ```javascript
    sap.ui.define([
        "Bar"
    ], function(Bar){
    });

    ```

=== "Not Supported"

    ```javascript hl_lines="3"
    const dependency = "Bar";
    sap.ui.define([
        dependency
    ], function(Bar){
    });
    ```

The same rule applies also for the usage of deprecated or no longer recommended APIs `jQuery.sap.declare`, `jQuery.sap.declare`, `define`, `require`, `require.predefine`, `sap.ui.predefine`, `sap.ui.requireSync` and `sap.ui.require.preload`.

#### Object Expression in Fiori Elements Template Declaration

When declaring a **Fiori Elements Template**, the usage of an **Object Expression** in the configuration is not supported.

=== "Supported"

    ```javascript
    sap.ui.define([
        "sap/fe/core/TemplateAssembler"
    ], function(TemplateAssembler) {
        return TemplateAssembler.getTemplateComponent(getMethods, 
            "sap.fe.templates.Page.Component", {
                metadata: {
                    properties: {
                        templateName: {
                            type: "string",
                            defaultValue: "sap.fe.templates.Page.view.Page"
                        }
                    },
                    manifest: "json"
                }
            }
        );
    });
    ```

=== "Not Supported"

    ```javascript hl_lines="9"
    sap.ui.define([
        "sap/fe/core/TemplateAssembler"
    ], function(TemplateAssembler) {
        const key = "templateName";
        return TemplateAssembler.getTemplateComponent(getMethods,
            "sap.fe.templates.Page.Component", {
                metadata: {
                    properties: {
                        [key]: {
                            type: "string",
                            defaultValue: "sap.fe.templates.Page.view.Page"
                        }
                    },
                    manifest: "json"
                }
            }
        );
    });
    ```

#### Object Expression in Smart Template Declaration

When declaring a **Smart Template*, the usage of an **Object Expression** in the configuration is not supported.

=== "Supported"

    ```javascript
    sap.ui.define([
        "sap/suite/ui/generic/template/lib/TemplateAssembler"
    ], function(TemplateAssembler) {
        return TemplateAssembler.getTemplateComponent(getMethods, 
            "sap.suite.ui.generic.templates.Page.Component", {
                metadata: {
                    properties: {
                        templateName: {
                            type: "string",
                            defaultValue: "sap.suite.ui.generic.templates.Page.view.Page"
                        }
                    },
                    manifest: "json"
                }
            }
        );
    });
    ```

=== "Not Supported"

    ```javascript hl_lines="9"
    sap.ui.define([
        "sap/suite/ui/generic/template/lib/TemplateAssembler"
    ], function(TemplateAssembler) {
        const key = "templateName"
        return TemplateAssembler.getTemplateComponent(getMethods,
            `sap.suite.ui.generic.templates.Page.${name}`, {
                metadata: {
                    properties: {
                        [key]: {
                            type: "string",
                            defaultValue: "sap.suite.ui.generic.templates.Page.view.Page"
                        }
                    }
                    manifest: "json"
                }
            }
        );
    });
    ```

#### Object Expression in XMLComposite Declaration

When declaring a **XMLComposite*, the usage of an **Object Expression** in the configuration is not supported.

=== "Supported"

    ```javascript
    sap.ui.define([
        "sap/ui/core/XMLComposite"
    ], function(XMLComposite) {
        return XMLComposite.extend("composites.MyComposite", {
            fragment: "composites.custom.MyComposite"
        } 
    });
    ```

=== "Not Supported"

    ```javascript hl_lines="6"
    sap.ui.define([
        "sap/ui/core/XMLComposite"
    ], function(XMLComposite) {
        const key = "fragment";
        return XMLComposite.extend("composites.MyComposite", {
            [key]: "composites.custom.MyComposite"
        });
    });
    ```

#### Object Expression in sap/ui/core/Core#initLibrary Call

A library is typically initialized via an accompanying `library.js`. Within that file, the object which is supplied to the `sap/ui/core/Core#initLibrary` method, must not use an **Object Expression**.

=== "Supported"

    ```javascript
    sap.ui.getCore().initLibrary({
        name: "my.lib"
    });
    ```

=== "Not Supported"

    ```javascript hl_lines="3"
    const key = "name";
    sap.ui.getCore().initLibrary({
        [key]: "my.lib"
    });
    ```

### Computed Property

A **Computed Property** can be used in all places except in following places.

#### Computed Property when using `extend`

One or more **Computed Property** as a parameter in an UI5 Module `extend` call is not supported.

=== "Supported"

    ```javascript
    sap.ui.define([
        "Bar"
    ], function(Bar){
        return Bar.extend("my.Bar" {});
    });

    ```

=== "Not Supported"

    ```javascript hl_lines="3"
    const name = "my";
    sap.ui.define([
        "Bar"
    ], function(Bar){
        return Bar.extend(name + ".Bar", {});
    });
    ```

#### Computed Properties in sap/ui/core/Core#initLibrary Call

A library is typically initialized via an accompanying `library.js`. Within that file, the object which is supplied to the `sap/ui/core/Core#initLibrary` method, must not use an **Computed Property**.

=== "Supported"

    ```javascript
    sap.ui.getCore().initLibrary({
        name: "my.lib"
    });
    ```

=== "Not Supported"

    ```javascript hl_lines="3"
    const name = "my";
    sap.ui.getCore().initLibrary({
        name: name + ".lib"
    });
    ```

### Class Declaration

If you want to generate a JSDoc build of your project and using a **Class Declaration** the class declaration should not be returned directly. Declare the class and return the class in a separate statement. If not JSDoc treats the the class declaration as a return statement and does not recognize any JSDoc if such is provided right above the class declaration.

=== "Supported"

    ```javascript
    sap.ui.define([
        "Bar"
    ], function(Bar){
        /**
         * JSDoc block here
         */
        class Foo extends Bar {
            make () {}
        }

        return Foo;
    });
    ```

=== "Not Supported"

    ```javascript hl_lines="7"
    sap.ui.define([
        "Bar"
    ], function(Bar){
        /**
         * JSDoc block here
         */
        return class Foo extends Bar {
            make () {}
        }
    });
    ```

### Arrow Function Expression

If you want to generate a JSDoc build of your project and use an **Arrow Function Expression** the JSDoc has to be written above the arrow function and not above the `sap.ui.define/sap.ui.require` command.

=== "Supported"

    ```javascript
    sap.ui.define([
        "Bar"
    ], 
    /**
     * JSDoc block here
     */
    (Bar) => Bar.extends("Foo", {

    }));
    ```

=== "Not Supported"

    ```javascript hl_lines="1 2 3"
    /**
     * JSDoc block here
     */
    sap.ui.define([
        "Bar"
    ], (Bar) => Bar.extends("Foo", {

    }));
    ```

## Code Analysis

During the build process, UI5 Tooling execute a static code analysis of a project. The following sections explain that process in more detail.

### Dependency Analysis

UI5 Tooling extracts dependency information from a project's code as outlined in the following chapters

#### JSModule Analyzer

The [JSModule Analyzer](https://github.com/SAP/ui5-builder/blob/main/lib/lbt/analyzer/JSModuleAnalyzer.js) uses the ["Abstract Syntax Tree"](https://en.wikipedia.org/wiki/Abstract_syntax_tree) (AST) of a JavaScript file to decide whether a code block is executed *conditionally* or *unconditionally*.
Besides this information, which is inherent to the JavaScript language, the analyzer uses additional knowledge about special API. For example, the factory function of an AMD-module is known to be executed when the module is executed, an IIFE is known to be executed immediately etc.

#### Component Analyzer

The [Component Analyzer](https://github.com/SAP/ui5-builder/blob/main/lib/lbt/analyzer/ComponentAnalyzer.js) analyzes JavaScript files named `Component.js` to collect dependency information by searching for a `manifest.json` in the same folder. If one is found, the `sap.ui5` section will be evaluated in the following way

- any library dependency is added as a dependency to the library.js module of that library. If the library dependency is modelled as 'lazy', the
 module dependency will be added as 'conditional'
- any component dependency is added as a dependency to the Component.js module of that component. If the Component dependency is modeled as 'lazy', the module dependency will be added as 'conditional'
- for each configured UI5 module, for which a type is configured, a module dependency to that type is added
- for each route that contains a view name, a module dependency to that view will be added

#### Fiori Elements Analyzer

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

#### Smart Template Analyzer

The [Smart Template Analyzer](https://github.com/SAP/ui5-builder/blob/main/lib/lbt/analyzer/SmartTemplateAnalyzer.js) analyzes a Smart Template app and its underlying template components to collect dependency information. It searches for a `manifest.json` in the same folder. If it is found and if it is a valid JSON, an "sap.ui.generic.app" section is searched and evaluated in the following way

- for each page configuration, the configured component is added as a dependency to the template app module
- If the page configuration contains a templateName, a dependency to that template view is added to the app
- Otherwise, the class definition of the component is analyzed to find a default template view name
   If found, a dependency to that view is added to the app module

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

#### XML Template Analyzer

The XML Template Analyzer tackles XMLViews and XMLFragments. It parses the XML, collects controls and adds them as dependency to the ModuleInfo object.
Additionally, some special dependencies are handled:

- controller of the view
- resource bundle (note: locale dependent dependencies can't be modeled yet in ModuleInfo)
- component referenced via ComponentContainer control
- embedded fragments or views

In an XMLView, there usually exist 3 categories of element nodes: controls, aggregations
of cardinality 'multiple' and non-UI5 nodes (e.g. XHTML or SVG). The third category usually
can be identified by its namespace. To distinguish between the first and the second
category, this analyzer uses a ResourcePool (provided by the caller and usually derived from the
library classpath). When the qualified node name is contained in the pool, it is assumed to
represent a control, otherwise it is ignored.

In certain cases this might give wrong results, but loading the metadata for each control
to implement the exactly same logic as used in the runtime XMLTemplateProcessor would be to
expensive and require too much runtime.

#### XML Composite Analyzer

The **XMLComposite** control is deprecated since UI5 Version 1.88. Nevertheless UI5 Tooling will attempt to analyze the declaration of any such controls in a project. The Analyzer searches for the name of the configured fragment containing the **XMLComposite** control.

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

### Library Initialization

This analyzer checks every JavaScript file for occurences of a `sap/ui/core/Core#initLibrary` call. If so, the following information will be set:

- noLibraryCSS: false when the noLibraryCSS property had been set in the initLibrary info object
- types: string array with the names of the types contained in the library
- controls: string array with the names of the controls defined in the library
- elements: string array with the names of the elements defined in the library
- interfaces: string array with the names of the interfaces defined in the library

### JSDoc

The UI5 Tooling offers a JSDoc build, which is enhanced by UI5 specific JSDoc features.
