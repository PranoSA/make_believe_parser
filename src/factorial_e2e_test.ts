import { Lexer } from "./lexer";
import { Parser } from "./parse_code";
import { VM, runProgram } from "./vm";

const factorialExpressions : string [] = [
    "1 +3! *5",
    "3! +4",
    "3! +4! + 5!",
]

const expectedOutput : number[] = [1 + 3*2*1*5, 3*2*1 + 4, 3*2*1 + 4*3*2*1 + 5*4*3*2*1];

factorialExpressions.slice(0,1).forEach((expression, index) => {
    const tokens = Lexer(expression);
    const parser = new Parser(tokens, {}, 0);
    parser.beginParsing();
    
    const vm :VM = {
        stack : [],
        top : 0,
        program : parser.bytecode,
        ip : 0,
    };
    
    runProgram(vm);
    
    const result = vm.stack[vm.top-1];
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