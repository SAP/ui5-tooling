module.exports = {
	"parserOptions": {
		"sourceType": "module",
	},
	"env": {
		"node": true,
		"es2023": true
	},
	"extends": ["eslint:recommended", "google"],
	"plugins": [],
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double",
			{"allowTemplateLiterals": true}
		],
		"semi": [
			"error",
			"always"
		],
		"no-negated-condition": "off",
		"require-jsdoc": "off",
		"no-mixed-requires": "off",
		"max-len": [
			"error",
			{
				"code": 120,
				"ignoreUrls": true,
				"ignoreRegExpLiterals": true
			}
		],
		"no-implicit-coercion": [
			2,
			{"allow": ["!!"]}
		],
		"comma-dangle": "off",
		"no-tabs": "off",
		"no-console": "off", // scripts use console.log to print output
		"valid-jsdoc": 0,
	},
	"root": true
};
