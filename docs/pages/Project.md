# UI5 Project
## Normalizer
The purpose of the normalizer is to collect dependency information and to enrich it with project configuration (both done in [generateProjectTree](https://sap.github.io/ui5-tooling/module-@ui5_project.normalizer.html#.generateProjectTree)).

[Translators](#translators) are used to collect dependency information. The [Project Preprocessor](#project-preprocessor) enriches this dependency information with project configuration, typically from a `ui5.yaml` file. A development server and build process can use this information to locate project and dependency resources.

If you want to retrieve the project dependency graph without any configuration, you may use use the [generateDependencyTree](https://sap.github.io/ui5-tooling/module-@ui5_project.normalizer.html#.generateDependencyTree) API.

## Translators
Translators collect recursively all dependencies on a package manager specific layer and return information about them in a well-defined tree structure.

**Tree structure as returned by a Translator:**
````json
{
    "id": "projectA",
    "version": "1.0.0",
    "path": "/absolute/path/to/projectA",
    "dependencies": [
        {
            "id": "projectB",
            "version": "1.0.0",
            "path": "/path/to/projectB",
            "dependencies": [
                {
                    "id": "projectD",
                    "path": "/path/to/different/projectD"
                }
            ]
        },
        {
            "id": "projectD",
            "version": "1.0.0",
            "path": "/path/to/projectD"
        },
        {
            "id": "myStaticServerTool",
            "version": "1.0.0",
            "path": "/path/to/some/dependency"
        }
    ]
}
````
This dependency tree can be used as input for the [Project Preprocessor](#project-preprocessor):

### npm Translator
The npm translator is currently the default translator and looks for dependencies defined in the `package.json` file of a certain project. `dependencies`, `devDepedencies`, and [napa dependencies](https://github.com/shama/napa) (Git repositories which don't have a `package.json` file) are located via the Node.js module resolution logic.

### Static Translator
*This translator is currently intended for testing purposes only.*

Can be used to supply the full dependency information of a project in a single structured file.

**Example: `projectDependencies.yaml`**
````yaml
---
id: testsuite
version: ""
path: "./"
dependencies:
  - id: sap.f
    version: ""
    path: "../sap.f"
  - id: sap.m
    version: ""
    path: "../sap.m"
````

This can be used via `ui5 serve -b static:/path/to/projectDependencies.yaml`

## Project Preprocessor
Enhances a given dependency tree based on a projects [configuration](docs/Configuration.md).

**Enhanced dependency tree structure as returned by the Project Preprocessor:**
````json
{
    "id": "projectA",
    "version": "1.0.0",
    "path": "/absolute/path/to/projectA",
    "specVersion": "0.1",
    "type": "application",
    "metadata": {
        "name": "sap.projectA",
        "copyright": "Some copyright ${currentYear}"
    },
    "resources": {
        "configuration": {
            "paths": {
                "webapp": "app"
            }
        },
        "pathMappings": {
             "/": "app"
        }
    },
    "dependencies": [
        {
            "id": "projectB",
            "version": "1.0.0",
            "path": "/path/to/projectB",
            "specVersion": "0.1",
            "type": "library",
            "metadata": {
                "name": "sap.ui.projectB"
            },
            "resources": {
                "configuration": {
                    "paths": {
                        "src": "src",
                        "test": "test"
                    }
                },
                "pathMappings": {
                    "/resources/": "src",
                    "/test-resources/": "test"
                }
            },
            "dependencies": [
                {
                    "id": "projectD",
                    "version": "1.0.0",
                    "path": "/path/to/different/projectD",
                    "specVersion": "0.1",
                    "type": "library",
                    "metadata": {
                        "name": "sap.ui.projectD"
                    },
                    "resources": {
                        "configuration": {
                            "paths": {
                                "src": "src/main/uilib",
                                "test": "src/test"
                            }
                        },
                        "pathMappings": {
                            "/resources/": "src/main/uilib",
                            "/test-resources/": "src/test"
                        }
                    },
                    "dependencies": []
                }
            ]
        },
        {
            "id": "projectD",
            "version": "1.0.0",
            "path": "/path/to/projectD",
            "specVersion": "0.1",
            "type": "library",
            "metadata": {
                "name": "sap.ui.projectD"
            },
            "resources": {
                "configuration": {
                    "paths": {
                        "src": "src/main/uilib",
                        "test": "src/test"
                    }
                },
                "pathMappings": {
                    "/resources/": "src/main/uilib",
                    "/test-resources/": "src/test"
                }
            },
            "dependencies": []
        }
    ]
}
````
