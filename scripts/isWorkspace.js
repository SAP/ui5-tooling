import path from "node:path";
import {fileURLToPath} from "node:url";

const cliPath = path.relative(import.meta.dirname, fileURLToPath(import.meta.resolve("@ui5/cli/package.json")));

// no workspace detected
if (!cliPath.startsWith(path.join("..", ".."))) {
	process.exit(1);
}
