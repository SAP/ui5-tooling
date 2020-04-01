# UI5 CLI
## Installing the UI5 CLI
### Requirements
-   [Node.js](https://nodejs.org/) (**version 10 or higher** ⚠️)

### Installation
```sh
npm install --global @ui5/cli

# Verify installation
ui5 --help
```

## CLI Usage
### Overview
```
Usage: ui5 <command> [options]

Commands:
  ui5 add [--development] [--optional] <framework-libraries..>  Add a SAPUI5/OpenUI5 framework library to the project
                                                                configuration.
  ui5 build                 Build project in current directory
  ui5 init                  Initialize the UI5 Tooling configuration for an application or
                              library project.
  ui5 serve                 Start a web server for the current project
  ui5 tree                  Outputs the dependency tree of the current project to stdout. It
                              takes all relevant parameters of ui5 build into account.
  ui5 use <framework-info>  Initialize or update the UI5 Tooling framework configuration.
  ui5 versions              Shows the versions of all UI5 Tooling modules

Options:
  --help, -h               Show help  [boolean]
  --version, -v            Show version number  [boolean]
  --config                 Path to configuration file  [string]
  --translator, --t8r      Translator to use. Including optional colon separated translator parameters.  [string] [default: "npm"]
  --verbose                Enable verbose logging.[boolean]
  --loglevel, --log-level  Set the logging level (error|warn|info|verbose|silly).  [string] [default: "info"]

Examples:
  ui5 <command> --translator static:/path/to/projectDependencies.yaml Execute command using a "static" translator with translator
                                                                        parameters
  ui5 <command> --config /path/to/ui5.yaml Execute command using a project configuration from custom path
```

The CLI automatically checks for updates using [update-notifier](https://github.com/yeoman/update-notifier). While this is skipped in CI environments, you might also opt-out manually by following the steps described [here](https://github.com/yeoman/update-notifier/blob/master/readme.md#user-settings).

### Commands
#### add

`ui5 add [--development] [--optional] <framework-libraries..>` adds a SAPUI5/OpenUI5 framework library to the project configuration.

```
Positionals:
  framework-libraries  Framework library names  [array] [required] [default: []]

Options:
  --help, -h               Show help  [boolean]
  --version, -v            Show version number  [boolean]
  --config                 Path to configuration file  [string]
  --translator, --t8r      Translator to use. Including optional colon separated translator parameters.  [string] [default: "npm"]
  --verbose                Enable verbose logging  [boolean]
  --loglevel, --log-level  Set the logging level (error|warn|info|verbose|silly)  [string] [default: "info"]
  --development, -D        Add as development dependency  [boolean] [default: false]
  --optional, -O           Add as optional dependency  [boolean] [default: false]
```

#### build
`ui5 build [options]` builds the project in the current directory.

```
Commands:
    dev             Dev build: Skips non-essential and time-intensive tasks during build
    jsdoc           Build JSDoc resources
    preload         (default) Build project and create preload bundles
    self-contained  Build project and create self-contained bundle

Options:
    --help, -h                 Show help  [boolean]
    --version, -v              Show version number  [boolean]
    --config                   Path to config file  [string]
    --translator, --t8r        Translator to use. Including optional colon separated translator parameters.  [string] [default: "npm"]
    --verbose                  Enable verbose logging. [boolean]
    --loglevel, --log-level    Set the logging level (error|warn|info|verbose|silly).  [string] [default: "info"]
    --all, -a                  Include all project dependencies into build process [boolean] [default: false]
    --dest                     Path of build destination  [string] [default: "./dist"]
    --clean-dest               If present, clean the destination directory before building  [boolean] [default: false]
    --dev-exclude-project      A list of specific projects to be excluded from dev mode (dev mode must be active for this to be effective)  [array]
    --include-task             A list of specific tasks to be included to the default/dev set  [array]
    --exclude-task             A list of specific tasks to be excluded from default/dev set  [array]
    --framework-version        Overrides the framework version defined by the project  [string]

Examples:
    ui5 build --all                                                                      Preload build for project and dependencies to "./dist"
    ui5 build --all --exclude-task=* --include-task=createDebugFiles generateAppPreload  Build project and dependencies but only apply the createDebugFiles- and generateAppPreload tasks
    ui5 build --all --include-task=createDebugFiles --exclude-task=generateAppPreload    Build project and dependencies by applying all default tasks including the createDebugFiles task and excluding the generateAppPreload task
    ui5 build dev --all --dev-exclude-project=sap.ui.core sap.m                          Build project and dependencies in dev mode, except "sap.ui.core" and "sap.m" (useful in combination with --include-task)
    ui5 build dev                                                                        Build project and dependencies in dev mode. Only a set of essential tasks is executed.
```

#### init
`ui5 init [options]` initializes the UI5 Tooling configuration for an application or library project.

```
Options:
    --help, -h                Show help  [boolean]
    --version, -v             Show version number  [boolean]
    --config                  Path to config file  [string]
    --translator, --t8r       Translator to use. Including optional colon separated translator parameters.  [string] [default: "npm"]
    --verbose                 Enable verbose logging. [boolean]
    --loglevel, --log-level   Set the logging level (error|warn|info|verbose|silly).  [string] [default: "info"]
```

#### serve
`ui5 serve [options]` starts a web server for the current project.

```
Options:
    --help, -h                    Show help  [boolean]
    --version, -v                 Show version number  [boolean]
    --config                      Path to config file  [string]
    --translator, --t8r           Translator to use. Including optional colon separated translator parameters.  [string] [default: "npm"]
    --verbose                     Enable verbose logging. [boolean]
    --loglevel, --log-level       Set the logging level (error|warn|info|verbose|silly).  [string] [default: "info"]
    --port, -p                    Port to bind on (default for HTTP: 8080, HTTP/2: 8443)  [number]
    --open, -o                    Open web server root directory in default browser. Optionally, supplied relative path will be appended to the root URL  [string]
    --h2                          Shortcut for enabling the HTTP/2 protocol for the web server  [boolean] [default: false]
    --simple-index                Use a simplified view for the server directory  [boolean] [default: false]
    --accept-remote-connections   Accept remote connections. By default the server only accepts connections from localhost  [boolean] [default: false]
    --key                         Path to the private key  [string] [default: "$HOME/.ui5/server/server.key"]
    --cert                        Path to the certificate  [string] [default: "$HOME/.ui5/server/server.crt"]
    --sap-csp-policies            Always send content security policies 'sap-target-level-1' and 'sap-target-level-2' in report-only mode  [boolean] [default: false]
    --framework-version           Overrides the framework version defined by the project  [string]


Examples:
    ui5 serve                                                        Start a web server for the current project
    ui5 serve --h2                                                   Enable the HTTP/2 protocol for the web server (requires SSL certificate)
    ui5 serve --config /path/to/ui5.yaml                             Use the project configuration from a custom path
    ui5 serve --translator static:/path/to/projectDependencies.yaml  Use a "static" translator with translator parameters.
    ui5 serve --port 1337 --open tests/QUnit.html                    Listen to port 1337 and launch default browser with http://localhost:1337/test/QUnit.html
```

#### tree

`ui5 tree [options]` outputs the dependency tree of the current project to _stdout_. It takes all relevant parameters of `ui5 build` into account.

```
Options:
  --help, -h               Show help [boolean]
  --version, -v            Show version number [boolean]
  --config                 Path to configuration file [string]
  --translator, --t8r      Translator to use. Including optional colon separated translator parameters. [string] [default: "npm"]
  --verbose                Enable verbose logging. [boolean]
  --loglevel, --log-level  Set the logging level (error|warn|info|verbose|silly). [string] [default: "info"]
  --full                   Include more information (currently the project configuration) [boolean] [default: false]
  --json                   Output tree as formatted JSON string [boolean] [default: false]
  --dedupe                 Remove duplicate projects from project tree [boolean] [default: false]


Examples:
    ui5 tree                              Returns plain dependency tree as returned by the used translator
    ui5 tree --full                       Returns the dependency tree after UI5 specific configuration has been applied
    ui5 tree > tree.txt                   Pipes the dependency tree into a new file "tree.txt"
    ui5 tree --json --dedupe > tree.json  Pipes the dependency tree, excluding duplicates into a new file "tree.json"
```

#### use

`ui5 use <framework-info>` initializes or updates the UI5 Tooling [framework configuration](./Configuration.md#framework-configuration).

```
Positionals:
  framework-info  Framework name, version or both  [string] [required]

Options:
  --help, -h               Show help   [boolean]
  --version, -v            Show version number   [boolean]
  --config                 Path to configuration file   [string]
  --translator, --t8r      Translator to use. Including optional colon separated translator parameters.  [string] [default: "npm"]
  --verbose                Enable verbose logging.  [boolean]
  --loglevel, --log-level  Set the logging level (error|warn|info|verbose|silly).  [string] [default: "info"]
```

#### versions
`ui5 versions [options]` shows the versions of all UI5 Tooling packages.

```
Options:
    --help, -h                Show help  [boolean]
    --version, -v             Show version number  [boolean]
    --config                  Path to config file  [string]
    --translator, --t8r       Translator to use. Including optional colon separated translator parameters.  [string] [default: "npm"]
    --verbose                 Enable verbose logging. [boolean]
    --loglevel, --log-level   Set the logging level (error|warn|info|verbose|silly).  [string] [default: "info"]

```

### Local vs. Global Installation
In general, we recommend a global installation of the UI5 CLI (`npm install --global @ui5/cli`).

However, it makes sense to add the UI5 CLI as a [devDependency](https://docs.npmjs.com/files/package.json#devdependencies) (`npm install --save-dev @ui5/cli`) for a project that is using `ui5` commands in its build or test scripts or otherwise depends on the UI5 CLI for development workflows (like continuous integration).

In case you have both, a local installation in one of your projects as well as a global installation, the UI5 CLI will always try to invoke the local installation. This is in part because [npm scripts](https://docs.npmjs.com/misc/scripts) defined in your `package.json` will also always invoke the local installation.

This behavior can be disabled by setting the environment variable `UI5_CLI_NO_LOCAL`.

**Example**  
You have a project located at `/my-application`. The project has a devDependency to `@ui5/cli` and defines the start script `"ui5 serve"`.

| Current Working Directory | Command                         | Uses globally installed UI5 CLI | Uses locally installed UI5 CLI |
| ------------------------- | ------------------------------- | :-----------------------------: | :----------------------------: |
| `/`                       |  `ui5 --version`                |               ✔️                |
| `/my-application`         |  `ui5 --version`                |                                 |               ✔️               |
| `/my-application`         |  `ui5 serve`                    |                                 |               ✔️               |
| `/my-application`         |  `npm start`                    |                                 |               ✔️               |
| `/my-application`         |  `UI5_CLI_NO_LOCAL=X ui5 serve` |               ✔️                |
| `/my-application`         |  `UI5_CLI_NO_LOCAL=X npm start` |                                 |               ✔️               |
