import eslintCommonConfig from "./eslint.common.config.js";

export default [
	{
		// Add project-specific ignore patterns for ESLint here
		// to add to common config
		ignores: ["**/site/"]
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
