import { Lexer } from "./lexer";
import { Parser } from "./parse_code";
import { VM, runProgram } from "./vm";



//Parse Flags
const Arguments = process.argv;

//Check for flags
let flags = new Map<string, string>();
for (let i = 0; i < Arguments.length; i++) {
    if (Arguments[i].startsWith('-')) {
        flags.set(Arguments[i], Arguments[i + 1]);
    }
}

//Check for help flag
if (flags.has('-h') || flags.has('--help')) {
    console.log("Usage: run_program [options] [file]");
    console.log("Options:");
    console.log("  -h, --help     Show this message");
    console.log("  -v, --version  Show version");
    process.exit(0);
}

// Check For the -target flag
let target = flags.get('-target');
let file_in = flags.get('-i');
let file_out = flags.get('-o');

// Check if "LEX is the target"
if (target === "LEX") {
    // Get the file name
    if(!file_out){
        // If no file specified, stdout
        file_out = "stdout";
    }

    //Read the file 
    if(!file_in){
        console.log("No input file specified");
        process.exit(1);
    }

    //Read the file contents
    const fs = require('fs');
    let file
    try {
        file = fs.readFileSync(file_in, 'utf8');
    } catch (err) {
        console.error("Error reading file: " + err);
        process.exit(1);
    }


    // Run the lexer
    let lexer = Lexer(file);

    //Write to file out
    if(file_out === "stdout"){
        console.log(lexer);
    }
    
    else{
        try {
            fs.writeFileSync(file_out, lexer);
        } catch (err) {
            console.error("Error writing to file: " + err);
            process.exit(1);
        }
    }

    process.exit(0);
}

if(target === "PARSE"){
    // Get the file name
    if(!file_out){
        // If no file specified, stdout
        file_out = "stdout";
    }

    //Read the file 
    if(!file_in){
        console.log("No input file specified");
        process.exit(1);
    }

    //Read the file contents
    const fs = require('fs');
    let file
    try {
        file = fs.readFileSync(file_in, 'utf8');
    } catch (err) {
        console.error("Error reading file: " + err);
        process.exit(1);
    }

    // Run the lexer
    let lexer = Lexer(file);

    //Pars

    //Write to file out
    if(file_out === "stdout"){
        console.log(lexer);
    }
    
    else{
        try {
            fs.writeFileSync(file_out, lexer);
        } catch (err) {
            console.error("Error writing to file: " + err);
            process.exit(1);
        }
    }

    process.exit(0);
}

if(target === "bytecode"){
    // Get the file name
    if(!file_out){
        // If no file specified, stdout
        file_out = "stdout";
    }

    //Read the file 
    if(!file_in){
        console.log("No input file specified");
        process.exit(1);
    }

    //Read the file contents
    const fs = require('fs');
    let file
    try {
        file = fs.readFileSync(file_in, 'utf8');
    } catch (err) {
        console.error("Error reading file: " + err);
        process.exit(1);
    }

    // Run the lexer
    let lexer = Lexer(file);
    //parse the lexer output
    const parser = new Parser(lexer, {}, 0);

    parser.beginParsing();

    const vm :VM = {
        stack: [],
        top : 0,
        program : parser.bytecode,
        ip : 0,
        program_states : [],
        state_branch : [],
    }

    const result = runProgram(vm);



    //Pars

    //Write to file out
    if(file_out === "stdout"){
        console.log(result?.toString());
    }
    
    else{
        try {
            fs.writeFileSync(file_out, result?.toString());
        } catch (err) {
            console.error("Error writing to file: " + err);
            process.exit(1);
        }
    }

    process.exit(0);
}