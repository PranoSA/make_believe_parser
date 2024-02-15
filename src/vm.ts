
import { Program} from './parse_code';
import { Opcode } from './parse_code';

type VM = {
    stack : number[],
    top : number,
    program : Program,
    ip : number,
}

function initVM(program:Program):VM {
    return {
        stack : [],
        top : 0,
        program,
        ip : 0,
    }
}




function runProgram(vm : VM){

    //WHile The current instruction is not 0xFF
    let opcode = vm.program.code[vm.ip];

    while(opcode !== 0xFF){
        
        opcode = vm.program.code[vm.ip];
        if(opcode === 0xFF){
            break;
        }
        vm.ip++;
        switch(opcode){
            case Opcode.OP_LOG:
                vm.stack[vm.top-1] = Math.log(vm.stack[vm.top-1]);
                break;
            case Opcode.OP_ADD:
                vm.stack[vm.top-2] = vm.stack[vm.top-1] + vm.stack[vm.top - 2];
                vm.top--;
                break;
            case Opcode.OP_SUB:
                vm.stack[vm.top-2] = vm.stack[vm.top-2] - vm.stack[vm.top - 1];
                vm.top--;
                break;
            case Opcode.OP_MUL:
                vm.stack[vm.top-2] = vm.stack[vm.top-1] * vm.stack[vm.top - 2];
                vm.top--;
                break;
            case Opcode.OP_DIV:
                vm.stack[vm.top-2] = vm.stack[vm.top-2] / vm.stack[vm.top - 1];
                vm.top--;
                break;
            case Opcode.OP_MOD:
                vm.stack[vm.top-2] = vm.stack[vm.top-2] % vm.stack[vm.top - 1];
                vm.top--;
                break;
            case Opcode.OP_CONST:
                //Get The Operand
                const operand_index = vm.program.code[vm.ip];
                vm.ip++;
                const constant = vm.program.constants[operand_index];          
                vm.stack[vm.top] = constant;
                vm.top++;
                break;
                //next byte is constant
            default:
                throw new Error(`Unrecognized opcode: ${opcode}`);
        }
    }
    return vm.stack[vm.top];
}

export type { VM, Program, ASTBranch };
export { initVM,  runProgram, Opcode, genAST, runAST };


type ASTBranch = {
    left : ASTBranch|undefined,
    right : ASTBranch|undefined,
    operator : string, //+, -, * , /, %, !
    //SOme Operators Will Have only one child, like % and !
}

function genAST(vm :VM){
    /*
    Encounter an Operation -> 
    Add previous two values are left and right respectively
    3! +4 -> 3! -> Would turn into a single node AST
        +      
    !       4
    3

    */

    //We Push Values Onto The Stack
    //Then When Encounteing an Operator, We Put the Last Two Values As Children of the Operator
    // 
    var ASTStack : ASTBranch[] = [];

    // Get The Last Two ASTs and make them children of the current operator

    let opcode = vm.program.code[vm.ip];
    while(opcode !== 0xFF){
        opcode = vm.program.code[vm.ip];
        if(opcode === 0xFF){
            break;
        }
        vm.ip++;
        switch(opcode){
            
            case Opcode.OP_ADD:
                let rightAdd = ASTStack.pop();
                let leftAdd = ASTStack.pop();
                let operatorAdd = "+";
                ASTStack.push({left: leftAdd, right: rightAdd, operator: operatorAdd});
                break;
            case Opcode.OP_SUB:
                let rightSub = ASTStack.pop();
                let leftSub = ASTStack.pop();
                let left: ASTBranch | undefined;
                let right: ASTBranch | undefined;
                let operator: string;
            case Opcode.OP_LOG:
                right = ASTStack.pop();
                left = ASTStack.pop();
                operator = "log";
                ASTStack.push({ left, right, operator });
                break;
            case Opcode.OP_MUL:
                right = ASTStack.pop();
                left = ASTStack.pop();
                operator = "*";
                ASTStack.push({ left, right, operator });
                break;
            case Opcode.OP_DIV:
                right = ASTStack.pop();
                left = ASTStack.pop();
                operator = "/";
                ASTStack.push({ left, right, operator });
                break;

        case Opcode.OP_ADD:
            right = ASTStack.pop();
            left = ASTStack.pop();
            operator = "+";
            ASTStack.push({ left, right, operator });
            break;
        case Opcode.OP_SUB:
            right = ASTStack.pop();
            left = ASTStack.pop();
            operator = "-";
            ASTStack.push({ left, right, operator });
            break;
        case Opcode.OP_MUL:
            right = ASTStack.pop();
            left = ASTStack.pop();
            operator = "*";
            ASTStack.push({ left, right, operator });
            break;
        case Opcode.OP_DIV:
            right = ASTStack.pop();
            left = ASTStack.pop();
            operator = "/";
            ASTStack.push({ left, right, operator });
            break;
        case Opcode.OP_MOD:
            right = ASTStack.pop();
            left = ASTStack.pop();
            operator = "%";
            ASTStack.push({ left, right, operator });
            break;
        case Opcode.OP_CONST:
            //Get The Operand
            const operand_index = vm.program.code[vm.ip];
            vm.ip++;
            const constant = vm.program.constants[operand_index];
            ASTStack.push({ left: undefined, right: undefined, operator: constant.toString() });
            break;
        default:
            throw new Error(`Unrecognized opcode: ${opcode}`);
        }

    }
    return ASTStack;

}

function runAST(ast: ASTBranch|undefined): number {
    if (ast === undefined) {
        return 0;
    }
    if (ast.left === undefined && ast.right === undefined) {
        return parseInt(ast.operator);
    }
    switch (ast.operator) {
        case "+":
            return runAST(ast.left) + runAST(ast.right);
        case "-":
            return runAST(ast.left) - runAST(ast.right);
        case "*":
            return runAST(ast.left) * runAST(ast.right);
        case "/":
            return runAST(ast.left) / runAST(ast.right);
        case "%":
            return runAST(ast.left) % runAST(ast.right);
        default:
            throw new Error(`Unrecognized operator: ${ast.operator}`);
    }

}
