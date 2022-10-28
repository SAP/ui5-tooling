import path from "node:path";
import {fileURLToPath} from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Using CommonsJS require.resolve as long as import.meta.resolve is experimental
import {createRequire} from "node:module";
const require = createRequire(import.meta.url);

const cPath = require.resolve("@ui5/cli/package.json");
const cliPath = path.relative(__dirname, path.dirname(cPath));

// no workspace detected
if (!cliPath.startsWith("..")) {
	process.exit(1);
}
