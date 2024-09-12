import eslintCommonConfig from "./eslint.common.config.js";

export default [
	{
		// Add project-specific ignore patterns for ESLint here
		// to add to common config
		ignores: ["**/site/", ".vitepress", "src", "tailwind.config.js", "docs", "postcss.config.js"]
	},
	...eslintCommonConfig, // Load common ESLint config
	{
		// Add remaining project-specific ESLint config rules here
		// in order to override common config
		rules: {
			"no-console": "off",
		}
	}
];
