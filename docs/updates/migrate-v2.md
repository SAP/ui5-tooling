# Migrate to v2

## Breaking changes


## How to upgrade

### Global installation

To upgrade your global installation, just run the installation command again, which will upgrade to the latest version.

```
npm install --global @ui5/cli
```

**Note:** Your local CLI installation will still be preferred, so you need to make sure to upgrade it as well (see [Local vs. Global installation](https://github.com/SAP/ui5-cli#local-vs-global-installation)).

### Local installation

To upgrade the CLI installation within a project you need to run the following command.

```
npm install @ui5/cli@^2
```

### ui5.yaml

#### `specVersion: '2.0'`

We have introduced the [specification version `2.0`](../pages/Configuration.md#specification-version-10).
New features will only be available for projects with specVersion `2.0` or newer.  
Most projects defining specVersion `0.1` or `1.0` can still be used.

```yaml
specVersion: '2.0'
metadata:
  name: <project-name>
type: <project-type>
```
