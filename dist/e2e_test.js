"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_1 = require("./lexer");
var parse_code_1 = require("./parse_code");
var vm_1 = require("./vm");
var test_table = [
    "1+2*3",
    "1*2+3",
    "1+2*3+4",
    "1*2+3*4",
    "1+2*3*4",
    "1*2+3+4",
    "1+2*3+4*5",
    "1*2+3*4+5*6",
];
var expected_output = [
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
test_table.slice(2, 3).forEach(function (program, index) {
    var tokens = (0, lexer_1.Lexer)(program);
    var parser = new parse_code_1.Parser(tokens, {}, 0);
    parser.beginParsing();
    // The Parser Will Change State, Now you need to pass the Bytecode and the Constants to the VM
    // The VM will run the bytecode and return the value on the stack
    var new_vm = {
        stack: [],
        top: 0,
        program: parser.bytecode,
        ip: 0,
    };
    (0, vm_1.runProgram)(new_vm);
    var result = new_vm.stack[new_vm.top - 1];
    if (result === expected_output[index]) {
        console.log("Test Passed");
    }
    else {
        console.log(program);
        console.log("Test Failed");
        console.log("Expected: ", expected_output[index], "  GOT : ", result);
        console.log(new_vm.stack);
        console.log(new_vm.program);
    }
});
