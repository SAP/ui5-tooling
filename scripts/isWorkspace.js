import path from "node:path";
import {fileURLToPath} from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
	const cPath = await import.meta.resolve("@ui5/cli/package.json");
	const cliPath = path.relative(__dirname, path.dirname(fileURLToPath(cPath)));

	// no workspace detected
	if (!cliPath.startsWith("..")) {
		process.exit(1);
	}
}

main().catch((error) => {
	console.log(error);
	process.exit(1);
});
