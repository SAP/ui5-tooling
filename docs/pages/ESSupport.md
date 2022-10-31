
## ECMAScript Version Support

The UI5 Tooling offers general support for the latest ECMAScript features. While a `ui5 build` is executed, the UI5 Tooling analyses the code on a few places. Depending on your project you have to consider some restrictions regarding the used ECMAScript syntax.

## General
The following sections describe the limitations valid for all types of projects.

### sap.ui.define/sap.ui.require: Usage of Object Expressions, Spread Elements and Template Literals
An `Object Expression`, `Spread Element` or  `Template Literal` with an expression is not supported as a parameter for `sap.ui.define` or `sap.ui.require`.

**✅ Best Practice:**
```javascript
sap.ui.define(["Bar"], function(Bar){
});
```

**⛔️ Not supported: Object Expression**
```javascript
const dependency = "Bar";
sap.ui.define([dependency], function(Bar){
});
```

**⛔️ Not supported: Spread Element**
```javascript
const dependenciesA = ["ModuleA1", "ModuleA2"];
const dependenciesB = ["ModuleB1", "ModuleB2"];
sap.ui.define([...dependenciesA, ...dependenciesB],
    function(ModuleA1, ModuleA2, ModuleB1, ModuleB2){
});
```

**⛔️ Not supported: Template Literal with Expression**
```javascript
sap.ui.define([`ModuleA`, `ModuleB` ], () => {
		const i = `D`;
		return sap.ui.require([
			`ModuleC`,
			`Module${i}`
		], () => { });
});
```

### XMLComposites
When declaring a `XMLComposite` any `Object Expression`, `Spread Element` or `Template Literal` with expression is not supported.

**✅ Best Practice:**
```javascript
sap.ui.define(["sap/ui/core/XMLComposite"],
	(XMLComposite) => XMLComposite.extend("composites.MyComposite", {
    });
```

**⛔️ Not supported: Object Expression**
```javascript
sap.ui.define([
	"sap/ui/core/XMLComposite"],
		(XMLComposite) => {
		const key = "fragment"
		return XMLComposite.extend("composites.MyComposite", {
			[key]: "composites.custom.MyComposite"
		});
	});
```

**⛔️ Not supported: Spread Element**
```javascript
sap.ui.define([
	"sap/ui/core/XMLComposite"],
		(XMLComposite) => {
		const myXMLComposite = {
			fragment: "composites.custom.MyComposite"
		};
		return XMLComposite.extend("composites.MyComposite", {
			...myXMLComposite
		});
	});
```

**⛔️ Not supported: Template Literal with Expression**
```javascript
sap.ui.define(["sap/ui/core/XMLComposite"],
	(XMLComposite) => {
        const name = "MyComposite";
	    return XMLComposite.extend(`composites.${name}`, {});
```

### Smart Templates
When declaring a `SmartTemplate` any `Object Expression`, `Spread Element` or `Template Literal` with expression is not supported.

**✅ Best Practice:**
```javascript
sap.ui.define(["sap/suite/ui/generic/template/lib/TemplateAssembler"],
	(TemplateAssembler) => TemplateAssembler.getTemplateComponent(getMethods,
		"sap.fe.templates.Page.Component", {
			metadata: {
				properties: {
					"templateName": {
						"type": "string",
						"defaultValue": "sap.fe.templates.Page.view.Page"
					}
				},
				"manifest": "json"
			}
        }
));
```

**⛔️ Not supported: Object Expression**
```javascript
sap.ui.define(["sap/suite/ui/generic/template/lib/TemplateAssembler"],
	(TemplateAssembler) => {
        const key =  "templateName";
        return TemplateAssembler.getTemplateComponent(getMethods,
		"sap.fe.templates.Page.Component", {
			metadata: {
				properties: {
					[key]: {
						"type": "string",
						"defaultValue": "sap.fe.templates.Page.view.Page"
					}
				},
				"manifest": "json"
			}
        })
    }
);
```

**⛔️ Not supported: Spread Element**
```javascript
sap.ui.define(["sap/suite/ui/generic/template/lib/TemplateAssembler"],
	(TemplateAssembler) => {
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
				"manifest": "json"
			}
        }
)});
```

**⛔️ Not supported: Template Literal with Expression**
```javascript
sap.ui.define(["sap/suite/ui/generic/template/lib/TemplateAssembler"],
	(TemplateAssembler) => {
        const name = "Component";
        return TemplateAssembler.getTemplateComponent(getMethods,
		`sap.fe.templates.Page.${name}`, {
			metadata: {
				properties: {
					"templateName": {
						"type": "string",
						"defaultValue": "sap.fe.templates.Page.view.Page"
					}
				},
				"manifest": "json"
			}
        }
)});
```

### Fiori Elements Template
When declaring a `Fiori Element Template` any `Object Expression`, `Spread Element` or `Template Literal` with expression is not supported.

**✅ Best Practice:**
```javascript
sap.ui.define(["sap/fe/core/TemplateAssembler"],
	(TemplateAssembler) => TemplateAssembler.getTemplateComponent(getMethods,
		"sap.fe.templates.Page.Component", {
			metadata: {
				properties: {
					"templateName": {
						"type": "string",
						"defaultValue": "sap.fe.templates.Page.view.Page"
					}
				},
				"manifest": "json"
			}
        }
));
```

**⛔️ Not supported: Object Expression**
```javascript
sap.ui.define(["sap/fe/core/TemplateAssembler"],
	(TemplateAssembler) => {
        const key =  "templateName";
        return TemplateAssembler.getTemplateComponent(getMethods,
		"sap.fe.templates.Page.Component", {
			metadata: {
				properties: {
					[key]: {
						"type": "string",
						"defaultValue": "sap.fe.templates.Page.view.Page"
					}
				},
				"manifest": "json"
			}
        })
    }
);
```

**⛔️ Not supported: Spread Element**
```javascript
sap.ui.define(["sap/fe/core/TemplateAssembler"],
	(TemplateAssembler) => {
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
				"manifest": "json"
			}
        }
)});
```

**⛔️ Not supported: Template Literal with Expression**
```javascript
sap.ui.define(["sap/fe/core/TemplateAssembler"],
	(TemplateAssembler) => {
        const name = "Component";
        return TemplateAssembler.getTemplateComponent(getMethods,
		`sap.fe.templates.Page.${name}`, {
			metadata: {
				properties: {
					"templateName": {
						"type": "string",
						"defaultValue": "sap.fe.templates.Page.view.Page"
					}
				},
				"manifest": "json"
			}
        }
)});
```

## Library
For libraries some special cases require following best practices.

### sap/ui/core/Core#initLibrary: Usage of Object Expression, Spread Element and Template Litaral
Typically in the `library.js` of your library the library is initialized. The object which is given to the `sap/ui/core/Core#initLibrary` call musst not include any `Object Expression`, `Spread Element` or `Template Literal` with expression.

**✅ Best Practice:**
```javascript
sap.ui.getCore().initLibrary({
    name: "my.lib"
```

**⛔️ Not supported: Object Expression**
```javascript
const mylib = {
    key: "name"
};
sap.ui.getCore().initLibrary({
    [mylib.key] : "my.lib",
```

**⛔️ Not supported: Spread Element**
```javascript
const mylib = {
    name: "my.lib"
};
sap.ui.getCore().initLibrary({
    ...mylib
```

**⛔️ Not supported: Template Literal with Expression**
```javascript
const name = "my"
sap.ui.getCore().initLibrary({
    name: `{$name}.lib`
```

### JSDoc
For libraries the JSDoc output might be relevant. Therefore, please follow the below best practices.

#### sap.ui.define/sap.ui.require: with Arrow function expression
The JSDoc block of the module has to be written above the arrow function and not above the `sap.ui.define/sap.ui.require` command.

**✅ Best Practice:**

```javascript
sap.ui.define(["Bar"],
    /**
     * JSDoc block here
     */
    (Bar) => Bar.extends("Foo", {...})
);
```

**⛔️ Not supported:**
```javascript
/**
 * JSDoc block here (Not detected properly!)
 */
sap.ui.define(["Bar"], (Bar) => Bar.extends("Foo", {...}));
```

#### sap.ui.define/sap.ui.require: Returning a class definition
The class declaration should not be returned directly. Declare the class and return the class in a separate statement. JSDoc treats the the class declaration as a return statement and does not recognize any JSDoc if such is provided right above the class declaration.

**✅ Best Practice:**
```javascript
sap.ui.define(["Bar"], function(Bar){
    /**
     * JSDoc block here
     */
    class Foo extends Bar {
        make () {
        ...
        }
    }

    return Foo;
});
```

**⛔️ Not supported:**
```javascript
sap.ui.define(["Bar"], function(Bar){
    /**
     * JSDoc block here
     */
    return class Foo extends Bar {
        make () {
        ...
        }
    }
});
```
