# Migrate to v1.0.0

v1.0.0 is the first stable release of the UI5 Build and Development Tooling. There are only a few notable changes to the 0.x alpha version.

## Breaking changes

* TBD
* ...

## How to upgrade

### Global installation

To upgrade your global installation, just run the installation command again, which will upgrade to the latest version.

```
npm install --global @ui5/cli
```

**Note:** Your local CLI installation will still be preferred, so you need to make sure to upgrade it as well (see below).

### Local installation

To upgrade the CLI installation within a project you need to run the following command.

```
npm install @ui5/cli@^1
```

### ui5.yaml

#### `specVersion: '1.0'`

We have introduced the specification version `1.0`.
New features will only be available for projects with specVersion `1.0` or newer.  
The specVersion `0.1` will be compatible with the UI5 CLI v1.0.0, but we still recommend to adopt your projects.

```yaml
specVersion: '1.0'
metadata:
  name: <project-name>
type: <project-type>
```
