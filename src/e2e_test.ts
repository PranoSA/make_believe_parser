import { Lexer } from "./lexer";
import {Parser} from "./parse_code";
import { VM, runProgram } from "./vm";

const test_table : string[] = [
    "1+2*3",
    "1*2+3",
    "1+2*3+4",
    "1*2+3*4",
    "1+2*3*4",
    "1*2+3+4",
    "1+2*3+4*5",
    "1*2+3*4+5*6",
];

const expected_output : number[] = [
    7,
    5,
    11,
    14,
    25,
    9,
    27,
    44,
];

// Start Lexing, Then Parsing, Then Run Through the VM -Final Value On The Stack



// Start Lexing
test_table.slice(2,3).forEach((program, index) => {
    const tokens = Lexer(program);


    const parser = new Parser(tokens, {}, 0);
    parser.beginParsing();

    // The Parser Will Change State, Now you need to pass the Bytecode and the Constants to the VM
    // The VM will run the bytecode and return the value on the stack

    const new_vm :VM = {
        stack : [],
        top : 0,
        program : parser.bytecode,
        ip : 0,
    };
    
    runProgram(new_vm);
    const result = new_vm.stack[new_vm.top-1];
    if (result === expected_output[index]) {
        console.log("Test Passed");
    } else {
        console.log(program)
        console.log("Test Failed");
        console.log("Expected: ", expected_output[index], "  GOT : ", result);
        console.log(new_vm.stack);
        console.log(new_vm.program);
    }
})