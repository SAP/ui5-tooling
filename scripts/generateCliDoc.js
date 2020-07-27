const exec = require('child_process').execSync;

const fs = require('fs');
const Handlebars = require('handlebars');

const source = fs.readFileSync('./scripts/resources/CLI.template.md', 'utf8');
const template = Handlebars.compile(source);


let first = true;
let obj = {
	common: "",
	usage: "",
	desc: "",
	positionals: [],
	commands: [],
	commonOptions: [],
	addOptions: [],
	examples: [],
};

function execute(command) {
	parseOutput(exec(command).toString());
}

function parseOutput(stdout) {
	let sections = stdout.split("\n\n");
	if (first) {
		for (let section of sections) {
			if (section.includes("Usage:")) {
				obj.common = section;
			}
			if (section.includes("Options:")) {
				obj.commonOptions = section.split("\n");
			}
			if (section.includes("Examples:")) {
				obj.examples = section.split("\n");
			}
			if (section.includes("Commands:")) {
				obj.commands = section.split("\n");
			}
		}
		first = false;
	}
	else {
		if(sections[0].includes("local")) {
			obj.usage = sections[1];
			obj.desc = sections[2];
		} else {
			obj.usage = sections[0];
			obj.desc = sections[1];
		}

		obj.commands = [];
		obj.examples = [];
		obj.positionals = [];
		obj.addOptions = [];
		for (let section of sections) {
			if (section.includes("Positionals:")) {
				obj.positionals = section.split("\n");
			}
			if (section.includes("Options:")) {
				obj.addOptions = section.split("\n").filter(function (el) {
					let array = obj.commonOptions;
					array.forEach(function (item, index, array) {
						array[index] = item.replace(/\s+/g, "");
					});
					return !array.includes(el.replace(/\s+/g, ""));
				});
			}
			if (section.includes("Examples:")) {
				obj.examples = section.split("\n");
			}
			if (section.includes("Commands:")) {
				obj.commands = section.split("\n");
			}
		}
	}

}

function generateDoc() {

	execute("ui5 --help");

	let optionObj = [];
	obj.commonOptions.shift();
	for (let all of obj.commonOptions) {
		let temp = checkChars(all);
		let command, description;
		({ command, description } = splitString(command, temp, description));
		optionObj.push({ commonOption: command, commonOptionDescription: description });
	}

	obj.examples.shift();
	let examplesObj = [];
	index = obj.examples[0].indexOf("Execute");
	for (let all of obj.examples) {
		let temp = checkChars(all);
		if (temp == '') {
			continue;
		}
		let command, description;
		({ command, description } = splitString(command, temp, description));
		examplesObj.push({ commonExample: command, commonExampleDescription: description });
	}

	obj.commands.shift();
	let commandsArray = [];
	let commands = obj.commands;
	for (let all of commands) {
		let command = all.trim().split(' ').slice(0, 2).join(' ');
		execute(command + ' --help');

		let commandsObj = [];
		obj.commands.shift();
		if (!(obj.commands.length <= 1)) {
			for (let all of obj.commands) {
				let temp = checkChars(all);
				let command, description;
				({ command, description } = splitString(command, temp, description));
				commandsObj.push({ childCommand: command, commandDescription: description });
			}
		}

		let positionalObj = [];
		obj.positionals.shift();

		if (!(obj.positionals.length < 1)) {
			let index = 0;
			for (let all of obj.positionals) {
				let temp = checkChars(all);
				let command, description;
				({ command, description } = splitString(command, temp, description));
				if (!(/\S/.test(command))) {
					positionalObj[index - 1].positionalDescription = positionalObj[index - 1].positionalDescription.concat("<br>", description);
					continue;
				}
				positionalObj.push({ positional: command, positionalDescription: description });
				index++;
			}
		}
		let optionObj = [];
		obj.addOptions.shift();
		if (!(obj.addOptions.length <= 1)) {
			for (let all of obj.addOptions) {
				let temp = checkChars(all);
				let command, description;
				({ command, description } = splitString(command, temp, description));
				optionObj.push({ option: command, optionDescription: description });
			}
		}

		let exampleObj = [];
		obj.examples.shift();
		if (!(obj.examples.length <= 1)) {
			for (let all of obj.examples) {
				let temp = checkChars(all);
				if (temp == '') {
					continue;
				}
				let command, description;
				({ command, description } = splitString(command, temp, description));
				exampleObj.push({ example: command, exampleDescription: description });
			}
		}

		let commandObj = {
			command: command,
			description: obj.desc,
			usage: obj.usage,
			childCommands: commandsObj,
			positionals: positionalObj,
			options: optionObj,
			examples: exampleObj
		};
		commandsArray.push(commandObj);
	}
	let content = template({
		common: obj.common.split("Usage:").join(""),
		commonOptions: optionObj,
		commonExamples: examplesObj,
		commands: commandsArray
	});

	content = content.split("&lt;").join("<").split("&gt;").join(">");
	content = content.split("&#x3D;").join("=");
	fs.writeFile('./docs/pages/CLI.md', content, err => {
		if (err) {
			return console.error(`Failed to generate docs/pages/CLI.md: ${err.message}.`);
		}

		console.log('Generated docs/pages/CLI.md');
	});

}

function splitString(command, temp, description) {
	command = temp.split(/[^\w.,]\s(?=[A-Z])/)[0].trim();
	description = temp.split(/[^\w.,]\s(?=[A-Z])/)[1].trim();
	return { command, description };
}

function checkChars(all) {
	let clean = all.split("|").join("\\\|");
	clean = clean.replace(/"\D+[di]\d{6,}/i, "\"$HOME/");
	return clean;
}

generateDoc();


