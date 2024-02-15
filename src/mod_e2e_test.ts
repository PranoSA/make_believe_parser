import { Lexer } from "./lexer";
import { Opcode, Parser } from "./parse_code";
import { VM, runProgram } from "./vm";

const expressions : string [] = [
    "5%3",
    "5+3*4%10",
    "5+3*4%10+1", //SHould be Evaluated as 5+(3*4)%10+1 = 5+2 +1 =8  or 5,3, 4, *, 10, %,  1, +
    //or 05 00, 05 01, 05 02, 02, 05 03, 04, 00, 05 04, 00
    //or ?? 5+3*4%10+1 -> 5+3*4+1
]

const expectedOutput : number[] = [2, 7, 5+3*4%10+1];

expressions.forEach((expression, index) => {
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