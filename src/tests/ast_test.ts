import { Lexer, Token } from "../lexer"
import { Parser } from "../parse_code"
import { TreeForJS3, VM, genAST, runAST, runProgram } from "../vm"

const test_table: string[] = [
    "5*4-1",
    "1 + 2 * 3",
    "1 + 2 * 3 + 4",
    "1 + 2 * 3 + 4 * 5",
    "1 + 2 * 3 + 4 * 5 + 6",
]

const test_table_expected : number[] = [
    19,
    7,
    11,
    27,
    33
]

test_table.slice(0,1).forEach((expr, index) => {
    const lexer:Token[] = Lexer(expr)
    const parser = new  Parser(lexer, {}, 0);
    parser.beginParsing();
    // Create Lexer Parser and VM
    const vm : VM = {
        stack : [],
        top : 0,
        program : parser.bytecode,
        ip : 0,
        program_states : [],
        state_branch : [],
    }

    const ast = genAST(vm)

    const result = runAST(ast[0])

    vm.ip = 0;

    const result2 = runProgram(vm)

    console.log(`Result: ${result} Expected: ${test_table_expected[index]}`);
    console.log(`Result2: ${result2} Expected: ${test_table_expected[index]}`);

    console.log(TreeForJS3(ast[0]))

    vm.state_branch.forEach((state, index) => {
       /* console.log(vm.program_states[index])
        console.log(state.left)
        console.log(state.right)
        console.log(state.operator)
        */
    })
})


