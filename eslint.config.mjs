import globals from "globals";
import path from "node:path";
import {fileURLToPath} from "node:url";
import js from "@eslint/js";
import {FlatCompat} from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default [{
	ignores: ["**/site/"],
}, ...compat.extends("eslint:recommended", "google"), {
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
		"valid-jsdoc": 0,
	},
}];
