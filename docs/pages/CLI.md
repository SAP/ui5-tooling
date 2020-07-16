# UI5 CLI
## Use the UI5 command line
### Requirements
* [Node.js](https://nodejs.org/) (**version 10 or higher** ⚠️)

### Installation

Install the CLI using the npm package manager:

```sh
npm install --global @ui5/cli

# Verify installation
ui5 --help
```

### Usage/Syntax

<<<<<<< HEAD
`
 ui5 <command> [options]
`

### Common options

These options you can use with each command.

| Option | Description |
| --- | --- |
|   --help, -h              | Show help  [boolean] |
|   --version, -v           | Show version number  [boolean] |
|   --config                | Path to configuration file  [string] |
|   --translator, --t8r     | Translator to use. Including optional colon separated translator parameters.  [string] [default: &quot;npm&quot;] |
|   --verbose               | Enable verbose logging.  [boolean] |
|   --loglevel, --log-level | Set the logging level (error\|warn\|info\|verbose\|silly).  [string] [default: &quot;info&quot;] |

### Examples

Execute command using a &quot;static&quot; translator with translator parameters
```
  ui5 <command> --translator static:/path/to/projectDependencies.yaml
```
Execute command using a project configuration from custom path
```
  ui5 <command> --config /path/to/ui5.yaml                           
```

## Commands

### ui5 add

#### Description

Add SAPUI5/OpenUI5 framework libraries to the project configuration.

#### Usage

`
ui5 add [--development] [--optional] <framework-libraries..>
`


#### Options

| Option | Description |
| --- | --- |
|   --development, -D, --dev | Add as development dependency  [boolean] [default: false] |
|   --optional, -O           | Add as optional dependency  [boolean] [default: false] |

#### Positionals

| Positional | Description |
| --- | --- |
|   framework-libraries | Framework library names  [array] [required] [default: []] |

#### Examples

Add the framework libraries sap.ui.core and sap.m as dependencies
```
  ui5 add sap.ui.core sap.m              
```
Add the framework library sap.ui.support as development dependency
```
  ui5 add -D sap.ui.support              
```
Add the framework library themelib_sap_fiori_3 as optional dependency
```
  ui5 add --optional themelib_sap_fiori_3
```
### ui5 build

#### Description

Build project in current directory

#### Usage

`
ui5 build
`

#### Child Commands

| Command | Description |
| --- | --- |
|   ui5 build dev            | Dev build |
|   ui5 build jsdoc          | Build JSDoc resources |
|   ui5 build preload         (default | Build project and create preload bundles |
|   ui5 build self-contained | Build project and create self-contained bundle |

#### Options

| Option | Description |
| --- | --- |
|   --all, -a               | Include all project dependencies into build process  [boolean] [default: false] |
|   --dest                  | Path of build destination  [string] [default: &quot;./dist&quot;] |
|   --clean-dest            | If present, clean the destination directory before building  [boolean] [default: false] |
|   --dev-exclude-project   | A list of specific projects to be excluded from dev mode (dev mode must be active for this to be effective)  [array] |
|   --include-task          | A list of specific tasks to be included to the default/dev set  [array] |
|   --exclude-task          | A list of specific tasks to be excluded from default/dev set  [array] |
|   --framework-version     | Overrides the framework version defined by the project  [string] |

=======
``` ui5 &lt;command&gt; [options]```

### Common options

| Option | Description |
| --- | --- |
|   --help, -h                | Show help  [boolean] |
|   --version, -v             | Show version number  [boolean] |
|   --config                  | Path to configuration file  [string] |
|   --translator, --t8r       | Translator to use. Including optional colon separated translator parameters.  [string] [default: &quot;npm&quot;] |
|   --verbose                 | Enable verbose logging.  [boolean] |
|   --loglevel, --log-level   | Set the logging level (error\|warn\|info\|verbose\|silly).  [string] [default: &quot;info&quot;] |

### Examples

Execute command using a &quot;static&quot; translator with translator parameters
```
  ui5 &lt;command&gt; --translator static:/path/to/projectDependencies.yaml  
```
Execute command using a project configuration from custom path
```
  ui5 &lt;command&gt; --config /path/to/ui5.yaml                             
```

```

```

## Commands

### ui5 add

#### Description

Add SAPUI5/OpenUI5 framework libraries to the project configuration.

<<<<<<< HEAD
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
    --serve-csp-reports           Collects and serves CSP reports upon request to '/.ui5/csp/csp-reports.json'  [boolean] [default: false]
    --framework-version           Overrides the framework version defined by the project  [string]
>>>>>>> [INTERNAL] Edit CLI documentation

#### Examples

Preload build for project and dependencies to &quot;./dist&quot;
```
<<<<<<< HEAD
  ui5 build --all                                                                    
```
Build project and dependencies but only apply the createDebugFiles- and generateAppPreload tasks
```
  ui5 build --all --exclude-task=* --include-task=createDebugFiles generateAppPreload
```
Build project and dependencies by applying all default tasks including the createDebugFiles task and excluding the generateAppPreload task
```
  ui5 build --all --include-task=createDebugFiles --exclude-task=generateAppPreload  
```
Build project and dependencies in dev mode, except &quot;sap.ui.core&quot; and &quot;sap.m&quot; (useful in combination with --include-task)
```
  ui5 build dev --all --dev-exclude-project=sap.ui.core sap.m                        
```
Build project and dependencies in dev mode. Only a set of essential tasks is executed.
```
  ui5 build dev                                                                      
```
### ui5 init

#### Description

Initialize the UI5 Tooling configuration for an application or library project.

#### Usage

`
ui5 init
`

=======
=======
#### Usage
>>>>>>> f8e70a4... [INTERNAL] Edit CLI documentation

`
ui5 add [--development] [--optional] &lt;framework-libraries..&gt;
`


#### Additional Options
>>>>>>> [INTERNAL] Edit CLI documentation

| Option | Description |
| --- | --- |
|   --development, -D, --dev  |  Add as development dependency  [boolean] [default: false] |
|   --optional, -O            |  Add as optional dependency  [boolean] [default: false] |


<<<<<<< HEAD
### ui5 remove

#### Description

=======
#### Examples

| Example | Description |
| --- | --- |
|   ui5 add sap.ui.core sap | .m                Add the framework libraries sap.ui.core and sap.m as dependencies |
|   ui5 add -D sap.ui.suppo | rt                Add the framework library sap.ui.support as development dependency |
|   ui5 add --optional them | elib_sap_fiori_3  Add the framework library themelib_sap_fiori_3 as optional dependency |
|  |  |

### ui5 build

#### Description

Build project in current directory

#### Usage

`
ui5 build
`

#### Child Commands

| Command | Description |
| --- | --- |
|   ui5 build dev             Dev build: Skips non-essential and t | ime-intensive tasks during build |
|   ui5 build jsdoc           Build JSDoc resources |  |
|   ui5 build preload         (default) Build project and create p | reload bundles |
|   ui5 build self-contained  Build project and create self-contai | ned bundle |

#### Additional Options

| Option | Description |
| --- | --- |
|   --all, -a                 | Include all project dependencies into build process  [boolean] [default: false] |
|   --dest                    | Path of build destination  [string] [default: &quot;./dist&quot;] |
|   --clean-dest              | If present, clean the destination directory before building  [boolean] [default: false] |
|   --dev-exclude-project     | A list of specific projects to be excluded from dev mode (dev mode must be active for this to be effective)  [array] |
|   --include-task            | A list of specific tasks to be included to the default/dev set  [array] |
|   --exclude-task            | A list of specific tasks to be excluded from default/dev set  [array] |
|   --framework-version       | Overrides the framework version defined by the project  [string] |


#### Examples

| Example | Description |
| --- | --- |
|   ui5 build --all         |                                                               Preload build for project and dependencies to &quot;./dist&quot; |
|   ui5 build --all --exclu | de-task&#x3D;* --include-task&#x3D;createDebugFiles generateAppPreload  Build project and dependencies but only apply the createDebugFiles- and generateAppPreload tasks |
|   ui5 build --all --inclu | de-task&#x3D;createDebugFiles --exclude-task&#x3D;generateAppPreload    Build project and dependencies by applying all default tasks including the createDebugFiles task and excluding the generateAppPreload task |
|   ui5 build dev --all --d | ev-exclude-project&#x3D;sap.ui.core sap.m                          Build project and dependencies in dev mode, except &quot;sap.ui.core&quot; and &quot;sap.m&quot; (useful in combination with --include-task) |
|   ui5 build dev           |                                                               Build project and dependencies in dev mode. Only a set of essential tasks is executed. |
|  |  |

### ui5 init

#### Description

Initialize the UI5 Tooling configuration for an application or library project.

#### Usage

`
ui5 init
`





### ui5 remove

#### Description

>>>>>>> [INTERNAL] Edit CLI documentation
Remove SAPUI5/OpenUI5 framework libraries from the project configuration.

#### Usage

`
<<<<<<< HEAD
ui5 remove <framework-libraries..>
=======
ui5 remove &lt;framework-libraries..&gt;
`




#### Examples

| Example | Description |
| --- | --- |
|   ui5 remove sap.ui.core  | sap.m  Remove the framework libraries sap.ui.core and sap.m as dependencies |
|  |  |

### ui5 serve

#### Description

Start a web server for the current project

#### Usage

`
ui5 serve
`


#### Additional Options

| Option | Description |
| --- | --- |
|   --port, -p                |     Port to bind on (default for HTTP: 8080, HTTP/2: 8443)  [number] |
|   --open, -o                |     Open web server root directory in default browser. Optionally, supplied relative path will be appended to the root URL  [string] |
|   --h2                      |     Shortcut for enabling the HTTP/2 protocol for the web server  [boolean] [default: false] |
|   --simple-index            |     Use a simplified view for the server directory listing  [boolean] [default: false] |
|   --accept-remote-connectio | ns  Accept remote connections. By default the server only accepts connections from localhost  [boolean] [default: false] |
|   --key                     |     Path to the private key  [string] [default: &quot;C:\Users\d073976\.ui5\server\server.key&quot;] |
|   --cert                    |     Path to the certificate  [string] [default: &quot;C:\Users\d073976\.ui5\server\server.crt&quot;] |
|   --sap-csp-policies        |     Always send content security policies &#x27;sap-target-level-1&#x27; and &#x27;sap-target-level-2&#x27; in report-only mode  [boolean] [default: false] |
|   --serve-csp-reports       |     Collects and serves CSP reports upon request to &#x27;/.ui5/csp/csp-reports.json&#x27;  [boolean] [default: false] |
|   --framework-version       |     Overrides the framework version defined by the project  [string] |


#### Examples

| Example | Description |
| --- | --- |
|   ui5 serve               |                                           Start a web server for the current project |
|   ui5 serve --h2          |                                           Enable the HTTP/2 protocol for the web server (requires SSL certificate) |
|   ui5 serve --config /pat | h/to/ui5.yaml                             Use the project configuration from a custom path |
|   ui5 serve --translator  | static:/path/to/projectDependencies.yaml  Use a &quot;static&quot; translator with translator parameters. |
|   ui5 serve --port 1337 - | -open tests/QUnit.html                    Listen to port 1337 and launch default browser with http://localhost:1337/test/QUnit.html |
|  |  |

### ui5 tree

#### Description

Outputs the dependency tree of the current project to stdout. It takes all relevant parameters of ui5 build into account.

#### Usage

`
ui5 tree
`


#### Additional Options

| Option | Description |
| --- | --- |
|   --full                    | Include more information (currently the project configuration)  [boolean] [default: false] |
|   --json                    | Output tree as formatted JSON string  [boolean] [default: false] |
|   --dedupe                  | Remove duplicate projects from project tree  [boolean] [default: false] |
|   --framework-version       | Overrides the framework version defined by the project. Only supported in combination with --full  [string] |


#### Examples

| Example | Description |
| --- | --- |
|   ui5 tree &gt; tree.txt     |       Pipes the dependency tree into a new file &quot;tree.txt&quot; |
|   ui5 tree --json &gt; tree. | json  Pipes the dependency tree into a new file &quot;tree.json&quot; |
|  |  |

### ui5 use

#### Description

Initialize or update the project&#x27;s framework configuration.

#### Usage

`
ui5 use &lt;framework-info&gt;
>>>>>>> [INTERNAL] Edit CLI documentation
`



#### Positionals

| Positional | Description |
| --- | --- |
<<<<<<< HEAD
|   framework-libraries | Framework library names  [array] [required] [default: []] |

#### Examples

Remove the framework libraries sap.ui.core and sap.m as dependencies
```
  ui5 remove sap.ui.core sap.m
```
### ui5 serve

#### Description

Start a web server for the current project

#### Usage

`
ui5 serve
`


#### Options

| Option | Description |
| --- | --- |
|   --port, -p                  | Port to bind on (default for HTTP: 8080, HTTP/2: 8443)  [number] |
|   --open, -o                  | Open web server root directory in default browser. Optionally, supplied relative path will be appended to the root URL  [string] |
|   --h2                        | Shortcut for enabling the HTTP/2 protocol for the web server  [boolean] [default: false] |
|   --simple-index              | Use a simplified view for the server directory listing  [boolean] [default: false] |
|   --accept-remote-connections | Accept remote connections. By default the server only accepts connections from localhost  [boolean] [default: false] |
|   --key                       | Path to the private key  [string] [default: &quot;$HOME/\.ui5\server\server.key&quot;] |
|   --cert                      | Path to the certificate  [string] [default: &quot;$HOME/\.ui5\server\server.crt&quot;] |
|   --sap-csp-policies          | Always send content security policies &#x27;sap-target-level-1&#x27; and &#x27;sap-target-level-2&#x27; in report-only mode  [boolean] [default: false] |
|   --serve-csp-reports         | Collects and serves CSP reports upon request to &#x27;/.ui5/csp/csp-reports.json&#x27;  [boolean] [default: false] |
|   --framework-version         | Overrides the framework version defined by the project  [string] |


#### Examples

Start a web server for the current project
```
  ui5 serve                                                      
```
Enable the HTTP/2 protocol for the web server (requires SSL certificate)
```
  ui5 serve --h2                                                 
```
Use the project configuration from a custom path
```
  ui5 serve --config /path/to/ui5.yaml                           
```
Use a &quot;static&quot; translator with translator parameters.
```
  ui5 serve --translator static:/path/to/projectDependencies.yaml
```
Listen to port 1337 and launch default browser with http://localhost:1337/test/QUnit.html
```
  ui5 serve --port 1337 --open tests/QUnit.html                  
```
### ui5 tree

#### Description

Outputs the dependency tree of the current project to stdout. It takes all relevant parameters of ui5 build into account.

#### Usage

`
ui5 tree
`


#### Options

| Option | Description |
| --- | --- |
|   --full                  | Include more information (currently the project configuration)  [boolean] [default: false] |
|   --json                  | Output tree as formatted JSON string  [boolean] [default: false] |
|   --dedupe                | Remove duplicate projects from project tree  [boolean] [default: false] |
|   --framework-version     | Overrides the framework version defined by the project. Only supported in combination with --full  [string] |


#### Examples

Pipes the dependency tree into a new file &quot;tree.txt&quot;
```
  ui5 tree > tree.txt        
```
Pipes the dependency tree into a new file &quot;tree.json&quot;
```
  ui5 tree --json > tree.json
```
### ui5 use

#### Description

Initialize or update the project&#x27;s framework configuration.

#### Usage

`
ui5 use <framework-info>
`



#### Positionals

| Positional | Description |
| --- | --- |
|   framework-info | Framework name, version or both (name@version).<br>Name can be &quot;SAPUI5&quot; or &quot;OpenUI5&quot; (case-insensitive).<br>Version can be &quot;latest&quot;, &quot;1.xx&quot; or &quot;1.xx.x&quot;.  [string] [required] |

#### Examples

Use SAPUI5 in the latest available version
```
  ui5 use sapui5@latest
```
Use OpenUI5 in the latest available 1.76 patch version
```
  ui5 use openui5@1.76 
```
Use the latest available version of the configured framework
```
  ui5 use latest       
```
Use OpenUI5 without a version (or use existing version)
```
  ui5 use openui5      
```
### ui5 versions

#### Description

Shows the versions of all UI5 Tooling modules

#### Usage

`
ui5 versions
`




=======
|   framework-info   | Framework name, version or both (name@version). |
|                    | Name can be &quot;SAPUI5&quot; or &quot;OpenUI5&quot; (case-insensitive). |
|                    | Version can be &quot;latest&quot;, &quot;1.xx&quot; or &quot;1.xx.x&quot;.  [string] [required] |

#### Examples

| Example | Description |
| --- | --- |
|   ui5 use sapui5@latest   | Use SAPUI5 in the latest available version |
|   ui5 use openui5@1.76    | Use OpenUI5 in the latest available 1.76 patch version |
|   ui5 use latest          | Use the latest available version of the configured framework |
|   ui5 use openui5         | Use OpenUI5 without a version (or use existing version) |
|  |  |

### ui5 versions

#### Description

Shows the versions of all UI5 Tooling modules

#### Usage

`
ui5 versions
`





>>>>>>> [INTERNAL] Edit CLI documentation

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
