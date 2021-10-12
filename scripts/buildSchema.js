/* eslint-disable no-console */

const path = require("path");
const {promisify} = require("util");
const fs = require("fs");
const writeFile = promisify(fs.writeFile);
const mkdirp = require("mkdirp");
const $RefParser = require("@apidevtools/json-schema-ref-parser");
const traverse = require("traverse");

const SOURCE_SCHEMA_PATH = require.resolve("@ui5/project/lib/validation/schema/ui5.json");
const TARGET_SCHEMA_PATH = path.join(__dirname, "..", "site", "schema", "ui5.yaml.json");

async function main() {
	const parser = new $RefParser();
	const schema = await parser.bundle(SOURCE_SCHEMA_PATH);

	// Remove $id from all nodes and $schema / $comment from all except the root node.
	// Defining $id on the root is not required and as the URL will be a different one it might even cause issues.
	// $schema only needs to be defined once per file.
	traverse(schema).forEach(function(v) {

		if (v && typeof v === "object" && !Array.isArray(v)) {
			if (v.$id) {
				delete v.$id;
			}
			if (!this.isRoot) {
				if (v.$schema) {
					delete v.$schema;
				}
				if (v.$comment) {
					delete v.$comment;
				}
			}
			this.update(v);
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
