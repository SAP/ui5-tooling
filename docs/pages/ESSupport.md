
# ECMAScript Support

The UI5 Tooling offers general support for `ES2022` ECMAScript features. While a `ui5 build` is executed, the UI5 Tooling analyses the code on a few places. Depending on the project type you have to consider some restrictions regarding the used ECMAScript syntax. The UI5 Tooling does only analyze files declared with type `script`. Files declared as `module` are not analyzed.

| UI5 Tooling Version | Supported ECMAScript Version |
| ------------------- | ---------------------------- |
| >= 3.0.0            | ES2022                       |
| < 3.0.0             | ECMAScript 2009 (aka ES5)    |

In section [Language Features with Limitations](#language-features-with-limitations) all limitations grouped by the kind of ECMAScript artefact are described. In section [Code Analyzing](#code-analyzing) there is a more detailed explaination what kind of code analysis is done by the UI5 Tooling.

## Language Features with Limitations

The following sections describe the limitations grouped by the ECMAScript artefact.

### Template Literal

Template Literals without an expression can be used in all places where string literals can be used. Template Literals with one or more expressions can be used in all places except in following places.

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

=== "Not supported"

    ```javascript hl_lines="4"
    const i = `B`;
    sap.ui.define([
        `ModuleA`,
        `Module${i}`
    ], function(ModuleA, ModuleB) {
    });
    ```

#### Template Literal in Fiori Elements Template declaration

When declaring a `Fiori Elements Template` using a `Template Literal` with one or more expressions in the name of the `Fiori Elements Template` is not supported.

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

=== "Not supported"

    ```javascript hl_lines="6"
    sap.ui.define([
        "sap/fe/core/TemplateAssembler"
    ], function(TemplateAssembler) {
        const name = "Component";
        return TemplateAssembler.getTemplateComponent(getMethods,
            `sap.fe.templates.Page.${name}`, {
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

#### Template Literal in Smart Template declaration

When declaring a `Smart Template` using a `Template Literal` with one or more expressions in the name of the `Smart Template` is not supported.

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

=== "Not supported"

    ```javascript hl_lines="6"
    sap.ui.define([
        "sap/suite/ui/generic/template/lib/TemplateAssembler"
    ], function(TemplateAssembler) {
        const name = "Component";
        return TemplateAssembler.getTemplateComponent(getMethods,
            `sap.suite.ui.generic.templates.Page.${name}`, {
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

#### Template Literal in XMLComposite declaration

The `XMLComposite` is deprecated since UI5 Version 1.88. Nevertheless the UI5 Tooling offers analyzing the declaration of XMLComposites.

When declaring a `XMLComposite` using a `Template Literal` with one or more expressions in the name of the `XMLComposite` is not supported.

=== "Supported"

    ```javascript
    sap.ui.define([
        "sap/ui/core/XMLComposite"
    ], function(XMLComposite) {
        return XMLComposite.extend("composites.MyComposite", {} 
    });
    ```

=== "Not supported"

    ```javascript hl_lines="5"
    sap.ui.define([
        "sap/ui/core/XMLComposite"
    ], function(XMLComposite) {
        const name = "MyComposite";
        return XMLComposite.extend(`composites.${name}`, {});
    });
    ```

#### Template Literal in sap/ui/core/Core#initLibrary call

Typically in the `library.js` of your library the library is initialized. The object which is given to the `sap/ui/core/Core#initLibrary` call musst not include any `Template Literal` with one or more expressions in the name of the library.

=== "Supported"

    ```javascript
    sap.ui.getCore().initLibrary({
        name: "my.lib"
    });
    ```

=== "Not supported"

    ```javascript hl_lines="5"
    const libraryName = `lib`;
    sap.ui.getCore().initLibrary({
        name: `my.${libraryName}`
    });
    ```

### Spread Element

A `Spread Element` can be used in all places except in following places.

#### Spread Element in `sap.ui.define` or `sap.ui.require`

A `Spread Element` as a parameter in a `sap.ui.define` or `sap.ui.require` call is not supported.

=== "Supported"

    ```javascript
    sap.ui.define([
        "ModuleA",
        "ModuleB"
    ], function(ModuleA, ModuleB) {
    });
    ```

=== "Not supported"

    ```javascript hl_lines="3"
    const dependencies = ["ModuleA", "ModuleB"];
    sap.ui.define([
        ...dependencies
    ], function(ModuleA, ModuleB) {
    });
    ```

#### Spread Element in Fiori Elements Template declaration

When declaring a `Fiori Elements Template` using a `Spread Element` in the configuration of the `Fiori Elements Template` is not supported.

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

=== "Not supported"

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

#### Spread Element in Smart Template declaration

When declaring a `Smart Template` using a `Spread Element` in the configuration of the `Smart Template` is not supported.

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

=== "Not supported"

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
            `sap.suite.ui.generic.templates.Page.${name}`, {
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

#### Spread Element in XMLComposite declaration

When declaring a `XMLComposite` using a `Spread Element` in the configuration of the `XMLComposite` is not supported.

=== "Supported"

    ```javascript
    sap.ui.define([
        "sap/ui/core/XMLComposite"
    ], function(XMLComposite) {
        return XMLComposite.extend("composites.MyComposite", {} 
    });
    ```

=== "Not supported"

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

#### Spread Element in sap/ui/core/Core#initLibrary call

Typically in the `library.js` of your library the library is initialized. The object which is given to the `sap/ui/core/Core#initLibrary` call musst not include any `Spread Element`.

=== "Supported"

    ```javascript
    sap.ui.getCore().initLibrary({
        name: "my.lib"
    });
    ```

=== "Not supported"

    ```javascript hl_lines="5"
    const mylib = {
        name: "my.lib"
    };
    sap.ui.getCore().initLibrary({
        ...mylib
    });
    ```

### Object Expression

An `Object Expression` can be used in all places except in following places.

#### Object Expression in `sap.ui.define` or `sap.ui.require`

An `Object Expression` as a parameter in a `sap.ui.define` or `sap.ui.require` call is not supported.

=== "Supported"

    ```javascript
    sap.ui.define([
        "Bar"
    ], function(Bar){
    });

    ```

=== "Not supported"

    ```javascript hl_lines="3"
    const dependency = "Bar";
    sap.ui.define([
        dependency
    ], function(Bar){
    });
    ```

#### Object Expression in Fiori Elements Template declaration

When declaring a `Fiori Elements Template` using an `Object Expression` in the configuration of the `Fiori Elements Template` is not supported.

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

=== "Not supported"

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

#### Object Expression in Smart Template declaration

When declaring a `Smart Template` using an `Object Expression` in the configuration of the `Smart Template` is not supported.

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

=== "Not supported"

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

#### Object Expression in XMLComposite declaration

When declaring a `XMLComposite` using an `Object Expression` in the configuration of the `XMLComposite` is not supported.

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

=== "Not supported"

    ```javascript hl_lines="6"
    sap.ui.define([
        "sap/ui/core/XMLComposite"
    ], function(XMLComposite) {
        const key = "fragment";
        return XMLComposite.extend(`composites.MyComposite`, {
            [key]: "composites.custom.MyComposite"
        });
    });
    ```

#### Object Expression in sap/ui/core/Core#initLibrary call

Typically in the `library.js` of your library the library is initialized. The object which is given to the `sap/ui/core/Core#initLibrary` call musst not include any `Object Expression`.

=== "Supported"

    ```javascript
    sap.ui.getCore().initLibrary({
        name: "my.lib"
    });
    ```

=== "Not supported"

    ```javascript hl_lines="3"
    const key = "name";
    sap.ui.getCore().initLibrary({
        [key]: "my.lib"
    });
    ```

### Class Definition

### Arrow Function Expression

## Code Analysis

### Dependency Analysis

### Library Initialization

### JSDoc
