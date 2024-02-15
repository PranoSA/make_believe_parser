import { Lexer } from "./lexer";
import {Parser} from "./parse_code";
import { VM, runProgram, genAST, runAST } from "./vm";

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
test_table.slice(0).forEach((program, index) => {
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

/*
    Now Run Test with Custom Precedence
*/

// Test AST Tree Generation Now

const ast_test_table : string[] = [
    "1+2*3",
    "1*2+3",
    "1+2*3+4",
    "1*2+3*4",
    "1+2*3*4",
    "1*2+3+4",
    "1+2*3+4*5",
    "1*2+3*4+5*6",
];

const expected_ast : string[] = [
    "1 + (2 * 3)",
    "(1 * 2) + 3",
    "1 + (2 * 3) + 4",
    "(1 * 2) + (3 * 4)",
    "1 + (2 * 3 * 4)",
    "(1 * 2) + 3 + 4",
    "1 + (2 * 3) + (4 * 5)",
    "(1 * 2) + (3 * 4) + (5 * 6)",
];

// 1+(2*3)
test_table.slice(0).forEach((program, index) => {
    const tokens = Lexer(program);
    const parser = new Parser(tokens, {}, 0);
    parser.beginParsing();

   // runProgram(parser.bytecode);

    const new_vm : VM = {
        stack : [],
        top : 0,
        program : parser.bytecode,
        ip : 0,
    }

    /*runProgram(new_vm);

    const result = new_vm.stack[new_vm.top-1];
    if (result === expected_output[index]) {
        console.log("Test Passed");
    } else {
        console.log(program)
        console.log("Test Failed");
        console.log("Expected: ", expected_output[index], "  GOT : ", result);
        console.log(new_vm.stack);
        console.log(new_vm.program);
    }*/

    //console.log(vm.stack[vm.top-1])

    const result = genAST(new_vm)

console.log(runAST(result[0]))

    // Parse Tree And Find If the AST Lines Up
    //expected root = "*"

    //console.log(result);
    /*if (result === expected_ast[index]) {
        console.log("Test Passed");
    } else {
        console.log(program)
        console.log("Test Failed");
        console.log("Expected: ", expected_ast[index], "  GOT : ", result);
    }*/
    console.log(result);
})

//log
const log_expression = "log(1+2*3)";
const tokenslog = Lexer(log_expression);
const parserlog = new Parser(tokenslog, {}, 0);
parserlog.beginParsing();

const new_vmlog :VM = {
    stack : [],
    top : 0,
    program : parserlog.bytecode,
    ip : 0,
};

runProgram(new_vmlog);

const resultlog = new_vmlog.stack[new_vmlog.top-1];
if (resultlog === Math.log(7)) {
    console.log("Test Passed");
}
else {
    console.log("Test Failed");
    console.log("Expected: ", 2.1972245773362196, "  GOT : ", resultlog);
    console.log(new_vmlog.stack);
    console.log(new_vmlog.program);
}


const custom_precedence = {
    "*_precedence" : 1,
    "/_precedence" : 1,
    "+_precedence" : 2,
    "-_precedence" : 2,
    "%_precedence" : 3,
}

/*
const test_table : string[] = [
    "1+2*3",
    "1*2+3",
    "1+2*3+4", 3*12
    "1*2+3*4", 1*5*4 = 20
    "1+2*3*4", 3*3*4 = 36
    "1*2+3+4", 1*(9) = 9
    "1+2*3+4*5", (3) * (7) *5 = 105
    "1*2+3*4+5*6", 1*(5) * (9) * 6 = 270
];*/
const expected_output_custom : number[] =[9, 5, 21, 20, 36, 9, 105,  270];

test_table.slice(0).forEach((program, index) => {
    const tokens = Lexer(program);

    const parser = new Parser(tokens, custom_precedence, 0);

    parser.beginParsing();

    // The Parser Will Change State, Now you need to pass the Bytecode and the Constants to the VM

    const new_vm :VM = {
        stack : [],
        top : 0,
        program : parser.bytecode,
        ip : 0,
    };

    runProgram(new_vm);

    const result = new_vm.stack[new_vm.top-1];

    if (result === expected_output_custom[index]) {
        console.log("Test Passed");
    } else {
        console.log(program)
        console.log("Test Failed");
        console.log("Expected: ", expected_output_custom[index], "  GOT : ", result);
        console.log(new_vm.stack);
        console.log(new_vm.program);
    }
})

const testCase = "4+3*5-2+5/5"


const custom_precedence2 = {
    "*_precedence" : 4,
    "/_precedence" : 2,
    "+_precedence" : 3,
    "-_precedence" : 5,
    "%_precedence" : 3,
}

const expecectedOutput = 3.6; // 4 + 3*(5-2)+5/5 = 4 + 3*3 + 5/5 = 4 +9 + 5/5 = (4 +9+5)/5 = 18/5 = 3.6

const tokens = Lexer(testCase);

const parser = new Parser(tokens, custom_precedence2, 0);

parser.beginParsing();

// The Parser Will Change State, Now you need to pass the Bytecode and the Constants to the VM
const new_vm :VM = {
    stack : [],
    top : 0,
    program : parser.bytecode,
    ip : 0,
};

//AST 
//const result2 = genAST(new_vm)

runProgram(new_vm);

const result = new_vm.stack[new_vm.top-1];

if (result === expecectedOutput) {
    console.log("Test Passed");
}

else {
    console.log("Test Failed");
    console.log("Expected: ", expecectedOutput, "  GOT : ", result);
    console.log(new_vm.stack);
    console.log(new_vm.program);
}


