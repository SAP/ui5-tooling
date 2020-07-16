const exec = require('child_process').execSync;

const fs = require('fs');
const Handlebars = require('handlebars');

const source = fs.readFileSync('./docs/pages/CLITemplate.md', 'utf8');
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
};

function parseOutput(stdout) {
    let sections = stdout.split("\n\n");
    if (first) {
        obj.common = sections[0];
        obj.commands = sections[1].split("\n");
        obj.commonOptions = sections[2].split("\n");
        obj.examples = sections[3].split("\n");
        first = false;

    }
    else {
        obj.usage = sections[0];
        obj.desc = sections[1];
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
                    array.forEach(function(item, index, array) {
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
        let temp = all.split("|").join("\\\|");
        let option, description;
        option = temp.slice(0, 27);
        description = temp.slice(27, temp.length);
        optionObj.push({ commonOption: option, commonOptionDescription: description });
    }

    obj.examples.shift();
    let examplesObj = [];
    index = obj.examples[0].indexOf("Execute");
    for (let all of obj.examples) {
        let temp = all.split("|").join("\\\|");
        let example, description;
        example = temp.slice(0, index);
        description = temp.slice(index, temp.length);
        examplesObj.push({ commonExample: example, commonExampleDescription: description });
    }
    
    obj.commands.shift();
    let commandsArray = [];
    let commands = obj.commands;
    for (let all of commands) {
        let command = all.trim().split(' ').slice(0,2).join(' ');
        execute(command + ' --help');

        let commandsObj = [];
        obj.commands.shift();
        if(!(obj.commands.length <= 1)) {
            for (let all of obj.commands) {
                let temp = all.split("|").join("\\\|");
                let command, description;
                command = temp.slice(0, 64);
                description = temp.slice(64, temp.length);
                commandsObj.push({ childCommand: command, commandDesc: description });
            }
        }

        let positionalObj = [];
        obj.positionals.shift();
        if(!(obj.positionals.length <= 1)) {
            for (let all of obj.positionals) {
                let temp = all.split("|").join("\\\|");
                let positional, description;
                positional = temp.slice(0, 18);
                description = temp.slice(18, temp.length);
                positionalObj.push({ positional: positional, positionalDesc: description });
            }
        }

        let optionObj = [];
        obj.addOptions.shift();
        if(!(obj.addOptions.length <= 1)) {
            for (let all of obj.addOptions) {
                let temp = all.split("|").join("\\\|");
                let option, description;
                option = temp.slice(0, 27);
                description = temp.slice(27, temp.length);
                optionObj.push({ option: option, optionDesc: description });
            }
        }

        let exampleObj = [];
        obj.examples.shift();
        if(!(obj.examples.length <= 1)) {
            for (let all of obj.examples) {
                let temp = all.split("|").join("\\\|");
                let example, description;
                example = temp.slice(0, 25);
                description = temp.slice(25, temp.length);
                exampleObj.push({ example: example, exampleDesc: description });
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
    const content = template({
        common: obj.common.split("Usage:").join(""),
        commonOptions: optionObj,
        commonExamples: examplesObj,
        commands: commandsArray
    });
    fs.writeFile('./docs/pages/CLI.md', content, err => {
        if (err) {
            return console.error(`Failed to store template: ${err.message}.`);
        }
    
        console.log('Saved template!');
    });
    
}

generateDoc();