- Start Date: 2019-06-11
- RFC PR: -
- Issue: -
- Affected components
    + [ ] [ui5-builder](https://github.com/SAP/ui5-builder)
    + [ ] [ui5-server](https://github.com/SAP/ui5-server)
    + [X] [ui5-cli](https://github.com/SAP/ui5-cli)
    + [ ] [ui5-fs](https://github.com/SAP/ui5-fs)
    + [X] [ui5-project](https://github.com/SAP/ui5-project)
    + [ ] [ui5-logger](https://github.com/SAP/ui5-logger)


# RFC 0006 Local Dependency Resolution

## Summary
It should be possible to easily and reliably work with locally cloned UI5 apps and libraries. 

This should work on top of the already existing npm dependency resolution.

## Motivation
Currently working with local npm/yarn links is hard:
- initial linking setup needs to be executed in the right order
    - becomes more and more complex when working with a lot of different repositories
- links may disappear when doing npm installs
- yarn and npm links can't be mixed
- Linking can be automated with scripts, but requires knowledge about the location of projects

**Use cases:**
- Local OpenUI5 library development (no external dependencies)
- Local development of OpenUI5 Suite libraries (Dist layer)
- Local app development against local OpenUI5 and OpenUI5 Suite libraries
- Local app development against local reuse library
- Local app development against local reuse library that is not published to npm

By using the workspace mode, it should be possible to use dependencies from local folders without the need to use the npm/yarn link feature.

The required initial steps and configuration should be as minimal and easy as possible.

It should be possible to provide a project with configuration that requires no extra steps from the developer to use (i.e. npm install && ui5 serve -o).

It should be up to the project to decide whether this configuration is part of the project files (tracked via SCM) or individual configuration per developer.

It should be possible to use only some local dependencies while others are consumed via standard node_modules resolution.

## Detailed design

### Directory and Configuration Structure
Recursive lookup of .ui5rc.yaml in the parent directories until one is found. There is no inheritance across multiple .ui5rc.yaml files.

The current project is always ignored from any .ui5rc.yaml resolutions.

If a matching modules package.json contains a Yarn workspace configuration, resolve that as well. Nested Yarn workspaces must not be resolved.

An additional package.json configuration should be used for resolving dependencies that are only present locally and not in any npm registry:
```json
"ui5": {
    "local-dependencies": [
        "my-first-library"
    ]
}
```

#### Example A
```
.ui5rc.yaml: local-resolution: ["./*"]
my-first-app/
    \_ package.json
my-first-library/
    \_ package.json
openui5/
    \_ .ui5rc.yaml: local-resolution: ["."]
    \_ package.json
    \_ src/
        \_ sap.ui.core/
            \_ package.json
        \_ sap.m/
            \_ package.json
        \_ testsuite/
            \_ package.json
openui5-suite/
    \_ .ui5rc.yaml: local-resolution: [".", "../openui5"]
    \_ package.json
    \_ src/
        \_ statusindicator/
            \_ package.json
```

**Use case:**
- All my-first-app and my-first-library dependencies should be resolved locally
    - Solved if the developer has the parent .ui5rc.yaml
- All OpenUI5 libraries should resolve their npm dependencies within the repository
    - Solved in the OpenUI5 repository. No additional depeveloper action required
- All OpenUI5 Suite libraries should use the local OpenUI5 libraries
    - Solved in the OpenUI5 and OpenUI5 Suite repository. No additional depeveloper action required

#### Example B
```
my-first-app/
    \_ .ui5rc.yaml: local-resolution ["../my-first-library"]
    \_ package.json
my-first-library/
    \_ package.json
```

**Use case:**
- my-first-app should use my-first-library
    - Solved in the app repository if developer has located the library in the same directory
- my-first-app and my-first-library should still use OpenUI5 and OpenUI5 Suite npm dependencies installed in node_modules

#### Example C
```
my-first-app/
    \_ .ui5rc.yaml: local-resolution ["../my-first-library"]
    \_ package.json: ui5: local-dependencies: ["my-first-library]
my-first-library/
    \_ package.json
```

**Use case:**
- my-first-app should use my-first-library but has no npm dependency defined in package.json
    - Solved by defining ui5-specific dependency configuration in package.json
    - Solved in the app repository if developer has located the library in the same directory

### Dependency Resolution Changes
TBD

### Activation of the workspace mode
If .ui5rc.yaml file is present in any parent directory, it is used by default.

Opt-out possible via CLI parameter: `--ignore-local-resolution`.

## How we teach this
What names and terminology work best for these concepts and why? How is this idea best presented?

Would the acceptance of this proposal mean the UI5 Tooling or any of its subcomponents documentation must be re-organized or altered?

How should this feature be introduced and taught to existing UI5 Tooling users?

## Drawbacks
Why should we not do this? Please consider the impact on teaching people to use the UI5 Tooling, on the integration of this feature with existing and planned features, on the impact of churn on existing users.

There are tradeoffs to choosing any path, please attempt to identify them here.

## Alternatives
What other designs have been considered? What is the impact of not doing this?

## Unresolved Questions and Bikeshedding
*This section should be removed (i.e. resolved) before merging*

- Name for the .ui5rc.yaml configuration
    - "workspace" not fully suitable
        - Yarns "workspace" configuration is something slightly different
        - You can't actually work *in* this kind of workspace
    - "local-dependencies"
    - "local-resolution"