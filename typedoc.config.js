/** @type {Partial<import('typedoc').TypeDocOptions>} */
const config = {
	entryPoints: ["./src/"],
	tsconfig: "tsconfig.build.json",
	out: "jsdocs",
	entryPointStrategy: "expand",
	plugin: ["typedoc-plugin-rename-defaults"],
};

export default config;
