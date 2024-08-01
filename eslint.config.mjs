import globals from "globals";
import js from "@eslint/js";
import google from "eslint-config-google";

export default [{
	ignores: ["**/site/"],
}, js.configs.recommended, google, {
	plugins: {},

	languageOptions: {
		globals: {
			...globals.node,
		},

		ecmaVersion: 2023,
		sourceType: "module",
	},

	rules: {
		"indent": ["error", "tab"],
		"linebreak-style": ["error", "unix"],

		"quotes": ["error", "double", {
			allowTemplateLiterals: true,
		}],

		"semi": ["error", "always"],
		"no-negated-condition": "off",
		"require-jsdoc": "off",
		"no-mixed-requires": "off",

		"max-len": ["error", {
			code: 120,
			ignoreUrls: true,
			ignoreRegExpLiterals: true,
		}],

		"no-implicit-coercion": [2, {
			allow: ["!!"],
		}],

		"comma-dangle": "off",
		"no-tabs": "off",
		"no-console": "off", // scripts use console.log to print out
		// This rule must be disabled as of ESLint 9.
		// It's removed and causes issues when present
		// https://eslint.org/docs/latest/rules/valid-jsdoc
		"valid-jsdoc": 0,
	}
}];
