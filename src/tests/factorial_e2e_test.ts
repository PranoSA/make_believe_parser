import { Lexer } from "../lexer";
import { Parser } from "../parse_code";
import { VM, runProgram } from "../vm";

const factorialExpressions : string [] = [
    "1 +3! *5",
    "3! +4",
    "3! +4! + 5!",
    "5!"
]

const expectedOutput : number[] = [1 + 3*2*1*5, 3*2*1 + 4, 3*2*1 + 4*3*2*1 + 5*4*3*2*1, 5*4*3*2*1];

factorialExpressions.forEach((expression, index) => {
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