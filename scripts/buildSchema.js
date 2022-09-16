import path from "node:path";
import {fileURLToPath, pathToFileURL} from "node:url";
import {writeFile} from "node:fs/promises";
import mkdirp from "mkdirp";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import traverse from "traverse";

// Using CommonsJS require.resolve as long as import.meta.resolve is experimental
import {createRequire} from "node:module";
const require = createRequire(import.meta.url);

const SOURCE_SCHEMA_PATH = fileURLToPath(
	new URL("./lib/validation/schema/ui5.json", pathToFileURL(require.resolve("@ui5/project")))
);
const TARGET_SCHEMA_PATH = fileURLToPath(
	new URL(`../site/schema/ui5.yaml.json`, import.meta.url)
);

async function main() {
	const parser = new $RefParser();
	const schema = await parser.bundle(SOURCE_SCHEMA_PATH);

	// Remove $id from all nodes and $schema / $comment from all except the root node.
	// Defining $id on the root is not required and as the URL will be a different one it might even cause issues.
	// $schema only needs to be defined once per file.
	traverse(schema).forEach(function(v) {
		// eslint-disable-next-line no-invalid-this
		const traverseContext = this;
		if (v && typeof v === "object" && !Array.isArray(v)) {
			if (v.$id) {
				delete v.$id;
			}
			if (!traverseContext.isRoot) {
				if (v.$schema) {
					delete v.$schema;
				}
				if (v.$comment) {
					delete v.$comment;
				}
			}
			traverseContext.update(v);
		}
	});

	await mkdirp(path.dirname(TARGET_SCHEMA_PATH));
	await writeFile(TARGET_SCHEMA_PATH, JSON.stringify(schema, null, 2));

	console.log("Wrote bundled ui5.yaml schema file to " + TARGET_SCHEMA_PATH);
}

main().catch((error) => {
	console.log(error);
	process.exit(1);
});
