
import { Program} from './parse_code';

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

enum Opcode {
    OP_ADD = 0x00,
    OP_SUB = 0x01,
    OP_MUL = 0x02,
    OP_DIV = 0x03,
    OP_MOD = 0x04,
    OP_CONST = 0x05,
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
            case Opcode.OP_ADD:
                vm.stack[vm.top-2] = vm.stack[vm.top-1] + vm.stack[vm.top - 2];
                vm.top--;
                break;
            case Opcode.OP_SUB:
                vm.stack[vm.top-2] = vm.stack[vm.top-1] - vm.stack[vm.top - 2];
                vm.top--;
                break;
            case Opcode.OP_MUL:
                vm.stack[vm.top-2] = vm.stack[vm.top-1] * vm.stack[vm.top - 2];
                vm.top--;
                break;
            case Opcode.OP_DIV:
                vm.stack[vm.top-2] = vm.stack[vm.top-1] / vm.stack[vm.top - 2];
                vm.top--;
                break;
            case Opcode.OP_MOD:
                vm.stack[vm.top-2] = vm.stack[vm.top-1] % vm.stack[vm.top - 2];
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

export type { VM, Program };
export { initVM,  runProgram, Opcode };