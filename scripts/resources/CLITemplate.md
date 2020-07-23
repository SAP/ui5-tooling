# UI5 CLI
## Requirements
* [Node.js](https://nodejs.org/) (**version 10 or higher** ⚠️)

## Installation

Install the CLI using the npm package manager:

```sh
npm install --global @ui5/cli

# Verify installation
ui5 --help
```

## Usage/Syntax

`
{{common}}
`

The CLI automatically checks for updates using [update-notifier](https://github.com/yeoman/update-notifier). While this is skipped in CI environments, you might also opt-out manually by following the steps described [here](https://github.com/yeoman/update-notifier/blob/master/readme.md#user-settings).

## Common options

These options you can use with each command.

| Option | Description |
| --- | --- |
{{#each commonOptions}}
| {{commonOption}} | {{commonOptionDescription}} |
{{/each}}

## Examples

{{#each commonExamples}}
{{commonExampleDescription}}
```
{{commonExample}}
```
{{/each}}

## Commands

{{#each commands}}
### {{command}}

**Description**

{{description}}

**Usage**

`
{{usage}}
`

{{#if childCommands}}
**Child Commands**

| Command | Description |
| --- | --- |
{{#each childCommands}}
| {{childCommand}} | {{commandDescription}} |
{{/each}}
{{/if}}

{{#if options}}
**Options**

| Option | Description |
| --- | --- |
{{#each options}}
| {{option}} | {{optionDescription}} |
{{/each}}
{{/if}}

{{#if positionals}}
**Positionals**

| Positional | Description |
| --- | --- |
{{#each positionals}}
| {{positional}} | {{positionalDescription}} |
{{/each}}
{{/if}}

{{#if examples}}
**Examples**

{{#each examples}}
{{exampleDescription}}
```
{{example}}
```
{{/each}}
{{/if}}
{{/each}}

## Local vs. Global Installation
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
