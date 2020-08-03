![UI5 logo](images/UI5_logo_wide.png)

# UI5 Tooling
An open and modular toolchain to develop state-of-the-art applications based on the [UI5](https://ui5.sap.com) framework.

## 🔥 ➡️ **[Get Started](./pages/GettingStarted.md)**


## Features
### 💻 UI5 CLI
*Also see the [CLI Documentation](./pages/CLI.md)*

```
npm install --global @ui5/cli
```

#### ⚙️ Setup Project

Configure your project for use with the UI5 Tooling.  
*Also see the [Configuration Documentation](./pages/Configuration.md)*

```
❯ ui5 init
Wrote ui5.yaml:

specVersion: '2.2'
metadata:
  name: my-app
type: application
```

#### 🚚 Add Dependencies

```
❯ ui5 use SAPUI5@1.76.0
Updated configuration written to ui5.yaml
This project is now using SAPUI5 version 1.76.0

❯ ui5 add sap.ui.core sap.m themelib_sap_fiori_3
Updated configuration written to ui5.yaml
Added framework libraries sap.ui.core sap.m themelib_sap_fiori_3 as dependencies
```

#### 🏄 Server
Start a local development server.  
*Also see the [Server Documentation](./pages/Server.md)*

```
❯ ui5 serve
Server started
URL: http://localhost:8080
```

#### 🛠 Builder
Build a production-ready package of your project.  
*Also see the [Builder Documentation](./pages/Builder.md)*

```
❯ ui5 build
Building my-app...
🔨 (1/8) Running task escapeNonAsciiCharacters...
🔨 (2/8) Running task replaceCopyright...
🔨 (3/8) Running task replaceVersion...
🔨 (4/8) Running task generateFlexChangesBundle...
🔨 (5/8) Running task generateComponentPreload...
🔨 (6/8) Running task createDebugFiles...
🔨 (7/8) Running task uglify...
🔨 (8/8) Running task generateVersionInfo...
Build succeeded in 363 ms
```

### 🧪 Node.js API
All UI5 Tooling modules provide JavaScript APIs available for direct consumption. They are documented in the [UI5 Tooling API Reference](https://sap.github.io/ui5-tooling/api/index.html).
