# Tasks and Processors

## Example: Minifier
#### Task
```js
import minifier from "../processors/minifier.js"; // Import processor

export default async function({workspace, taskUtil, options: {pattern, omitSourceMapResources = false}}) {
	const resources = await workspace.byGlob(pattern);
	const processedResources = await minifier({
		resources,
		options: {
			addSourceMappingUrl: !omitSourceMapResources
		}
	});

	return Promise.all(processedResources.map(async ({resource, dbgResource, sourceMapResource}) => {
		if (taskUtil) {
			taskUtil.setTag(resource, taskUtil.STANDARD_TAGS.HasDebugVariant);
			taskUtil.setTag(dbgResource, taskUtil.STANDARD_TAGS.IsDebugVariant);
			taskUtil.setTag(sourceMapResource, taskUtil.STANDARD_TAGS.HasDebugVariant);
			if (omitSourceMapResources) {
				taskUtil.setTag(sourceMapResource, taskUtil.STANDARD_TAGS.OmitFromBuildResult);
			}
		}
		return Promise.all([
			workspace.write(resource),
			workspace.write(dbgResource),
			workspace.write(sourceMapResource)
		]);
	}));
}
```

#### Processor
```js
import posixPath from "node:path/posix";
import {minify} from "terser";
import Resource from "@ui5/fs/Resource";

const copyrightCommentsAndBundleCommentPattern = /copyright|\(c\)(?:[0-9]+|\s+[0-9A-za-z])|released under|license|\u00a9|^@ui5-bundle-raw-include |^@ui5-bundle /i;
const debugFileRegex = /((?:\.view|\.fragment|\.controller|\.designtime|\.support)?\.js)$/;

export default async function({resources, options: {addSourceMappingUrl = true} = {}}) {
	return Promise.all(resources.map(async (resource) => {
		const dbgPath = resource.getPath().replace(debugFileRegex, "-dbg$1");
		const dbgResource = await resource.clone();
		dbgResource.setPath(dbgPath);

		const filename = posixPath.basename(resource.getPath());
		const code = await resource.getString();
		try {
			const sourceMapOptions = {
				filename
			};
			if (addSourceMappingUrl) {
				sourceMapOptions.url = filename + ".map";
			}
			const dbgFilename = posixPath.basename(dbgPath);
			const result = await minify({
				// Use debug-name since this will be referenced in the source map "sources"
				[dbgFilename]: code
			}, {
				output: {
					comments: copyrightCommentsAndBundleCommentPattern,
					wrap_func_args: false
				},
				compress: false,
				mangle: {
					reserved: [
						"jQuery",
						"jquery",
						"sap",
					]
				},
				sourceMap: sourceMapOptions
			});
			resource.setString(result.code);
			const sourceMapResource = new Resource({
				path: resource.getPath() + ".map",
				string: result.map
			});
			return {resource, dbgResource, sourceMapResource};
		} catch (err) {
			// Note: err.filename contains the debug-name
			throw new Error(
				`Minification failed with error: ${err.message} in file ${filename} ` +
				`(line ${err.line}, col ${err.col}, pos ${err.pos})`);
		}
	}));
}

```
