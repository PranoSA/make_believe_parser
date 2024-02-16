import { Lexer } from "./lexer";
import { Parser } from "./parse_code";
import { VM, runProgram } from "./vm";


const testTable : string[] = [
    "(1+2)*3", // 9
    "1*(2+3)", // 5 
    "1+(2*3)", // 7
    "5+3*4", // 17
    "(5+3)*4", // 32
    "5+(3*4)", // 17
    "1 + 5 *3 +4 /9", // 
    "(1+5)*(3+4)/9",
    "1 + (5*3+4/9)",
    "1 + 5*(3+4/9)",
]

const expectedOutput : number[] = [9, 5, 7, 17, 32, 17, 1 + 5 *3 +4 /9, (1+5)*(3+4)/9, 1+ + (5*3+4/9),1 + 5*(3+4/9) ];

testTable.forEach((expression, index) => {
    const tokens = Lexer(expression);
    const parser = new Parser(tokens, {}, 0);
    parser.beginParsing();
    
    const vm :VM = {
        stack : [],
        top : 0,
        program : parser.bytecode,
        ip : 0,
        program_states : [],
        state_branch : [],
    };
    
    const result = runProgram(vm);
    

    if (result === expectedOutput[index]) {
        console.log("Test Passed");
    }
    else {
        console.log("Test Failed");
        console.log("Expected: ", expectedOutput[index], "  GOT : ", result);
        console.log(vm.stack);
        console.log(vm.program);
    }
})
