
import { Token } from './lexer';
import { Program} from './parse_code';
import { Opcode } from './parse_code';

type VM = {
    stack : number[],
    top : number,
    program : Program,
    ip : number,
    program_states : VMSteps,
    state_branch : ASTBranch[],
}

function initVM(program:Program):VM {
    return {
        stack : [],
        top : 0,
        program,
        ip : 0,
        program_states : [],
        state_branch : [],
    }
}

type VMState = {
    stack : number[],
    constants : number[],
    currentToken : Opcode,
    name : string,
}

type VMSteps = VMState[];




function runProgram(vm : VM){

    //WHile The current instruction is not 0xFF
    let opcode = vm.program.code[vm.ip];
    if(vm.program_states === undefined){
        vm.program_states = [];
    }
    
    while(opcode !== 0xFF){

        opcode = vm.program.code[vm.ip];
        // Take Snapshot of VM State Here
        let step : VMState = {
            stack : [...vm.stack],
            constants : [...vm.program.constants],
            currentToken : opcode,
            name : Opcode[opcode],
        }

        if(opcode == Opcode.OP_CONST){
            step.name += " " + vm.program.constants[vm.program.code[vm.ip+1]];
        }
        
        
        vm.program_states.push(step);
    
        
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
                vm.stack.pop();
                vm.top--;
                break;
            case Opcode.OP_SUB:
                vm.stack[vm.top-2] = vm.stack[vm.top-2] - vm.stack[vm.top - 1];
                vm.top--;
                vm.stack.pop()
                break;
            case Opcode.OP_MUL:
                vm.stack[vm.top-2] = vm.stack[vm.top-1] * vm.stack[vm.top - 2];
                vm.top--;
                vm.stack.pop();
                break;
            case Opcode.OP_DIV:
                vm.stack[vm.top-2] = vm.stack[vm.top-2] / vm.stack[vm.top - 1];
                vm.top--;
                vm.stack.pop();
                break;
            case Opcode.OP_MOD:
                vm.stack[vm.top-2] = vm.stack[vm.top-2] % vm.stack[vm.top - 1];
                vm.top--;
                vm.stack.pop();
                break;
            case Opcode.OP_FACTORIAL:
                let result = 1;
                for (let i = 1; i <= vm.stack[vm.top-1]; i++){
                    result *= i;
                }
                vm.stack[vm.top-1] = result;
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
    vm.program_states.push({
        stack : [...vm.stack],
        constants : [...vm.program.constants],
        currentToken : 0xFF,
        name : "END",
    })
    return vm.stack.pop();
}

export type { VM, Program, ASTBranch, VMSteps, VMState , TreeForJs3};
export { initVM,  runProgram, Opcode, genAST, runAST, TreeForJS3 };


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
    let next_branch : ASTBranch;

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
                next_branch = { left: leftAdd, right: rightAdd, operator: operatorAdd };
                ASTStack.push(next_branch);
                vm.state_branch.push(next_branch);
                break;
            case Opcode.OP_SUB:
                let right = ASTStack.pop();
                let left= ASTStack.pop();
                
                let operator: string = "-";
                next_branch = { left, right, operator };
                ASTStack.push(next_branch);
                vm.state_branch.push(next_branch);
                break;

            case Opcode.OP_LOG:
                right = ASTStack.pop();
                left = ASTStack.pop();
                operator = "log";
                next_branch = { left, right, operator };
                ASTStack.push(next_branch);
                vm.state_branch.push(next_branch);
                break;
            case Opcode.OP_MUL:
                right = ASTStack.pop();
                left = ASTStack.pop();
                operator = "*";
                next_branch = { left, right, operator };
                ASTStack.push(  next_branch);
                vm.state_branch.push(next_branch);
                break;
            case Opcode.OP_FACTORIAL:
                right = ASTStack.pop();
                left = undefined;
                operator = "!";
                next_branch =   { left, right, operator };
                ASTStack.push(next_branch);
                vm.state_branch.push(next_branch);
                break;
            case Opcode.OP_DIV:
                right = ASTStack.pop();
                left = ASTStack.pop();
                operator = "/";
                next_branch = { left, right, operator };
                ASTStack.push(next_branch);
                vm.state_branch.push(next_branch);
                break;

        case Opcode.OP_ADD:
            right = ASTStack.pop();
            left = ASTStack.pop();
            operator = "+";
            next_branch = { left, right, operator };
            ASTStack.push(next_branch);
            vm.state_branch.push(next_branch);
            break;
        case Opcode.OP_SUB:
            right = ASTStack.pop();
            left = ASTStack.pop();
            operator = "-";
            next_branch = { left, right, operator };
            ASTStack.push(next_branch);
            vm.state_branch.push(next_branch);
            break;
        case Opcode.OP_MUL:
            right = ASTStack.pop();
            left = ASTStack.pop();
            operator = "*";
            next_branch = { left, right, operator };
            ASTStack.push(next_branch);
            vm.state_branch.push(next_branch);
            break;
        case Opcode.OP_DIV:
            right = ASTStack.pop();
            left = ASTStack.pop();
            operator = "/";
            next_branch = { left, right, operator };
            ASTStack.push(next_branch);
            vm.state_branch.push(next_branch);
            break;
        case Opcode.OP_MOD:
            right = ASTStack.pop();
            left = ASTStack.pop();
            operator = "%";
            next_branch = { left, right, operator };
            ASTStack.push(next_branch);
            vm.state_branch.push(next_branch);
            break;
        case Opcode.OP_CONST:
            //Get The Operand
            const operand_index = vm.program.code[vm.ip];
            vm.ip++;
            const constant = vm.program.constants[operand_index];
            next_branch = { left: undefined, right: undefined, operator: constant.toString() };
            ASTStack.push(next_branch);
            vm.state_branch.push(next_branch);
            break;
        default:
            throw new Error(`Unrecognized opcode: ${opcode}`);
        }

    }
    vm.ip = 0;
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
        case "log":
            return Math.log(runAST(ast.right));
        
        case "!":
            return runAST(ast.right);
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


/*
    Recursively Traverse the AST and Create a Tree
    For Each Node, Create a Tree Node
*/


type TreeForJs3 = {
    value: string,
    children: TreeForJs3[],
}


//Should Take In ASTBranch instead -> And Then Produce Children for Each CHid
function TreeForJS3(branches : ASTBranch) : TreeForJs3 {

    let tree : TreeForJs3 = {
        value : branches.operator,
        children : [],
    }

    if(branches.left !== undefined){
        tree.children.push(TreeForJS3(branches.left));
    }

    if(branches.right !== undefined){
        tree.children.push(TreeForJS3(branches.right));
    }

    return tree;
}