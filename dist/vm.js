"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Opcode = exports.runProgram = exports.initVM = void 0;
function initVM(program) {
    return {
        stack: [],
        top: 0,
        program: program,
        ip: 0,
    };
}
exports.initVM = initVM;
var Opcode;
(function (Opcode) {
    Opcode[Opcode["OP_ADD"] = 0] = "OP_ADD";
    Opcode[Opcode["OP_SUB"] = 1] = "OP_SUB";
    Opcode[Opcode["OP_MUL"] = 2] = "OP_MUL";
    Opcode[Opcode["OP_DIV"] = 3] = "OP_DIV";
    Opcode[Opcode["OP_MOD"] = 4] = "OP_MOD";
    Opcode[Opcode["OP_CONST"] = 5] = "OP_CONST";
})(Opcode || (exports.Opcode = Opcode = {}));
function runProgram(vm) {
    //WHile The current instruction is not 0xFF
    var opcode = vm.program.code[vm.ip];
    while (opcode !== 0xFF) {
        opcode = vm.program.code[vm.ip];
        if (opcode === 0xFF) {
            break;
        }
        vm.ip++;
        switch (opcode) {
            case Opcode.OP_ADD:
                vm.stack[vm.top - 2] = vm.stack[vm.top - 1] + vm.stack[vm.top - 2];
                vm.top--;
                break;
            case Opcode.OP_SUB:
                vm.stack[vm.top - 2] = vm.stack[vm.top - 1] - vm.stack[vm.top - 2];
                vm.top--;
                break;
            case Opcode.OP_MUL:
                vm.stack[vm.top - 2] = vm.stack[vm.top - 1] * vm.stack[vm.top - 2];
                vm.top--;
                break;
            case Opcode.OP_DIV:
                vm.stack[vm.top - 2] = vm.stack[vm.top - 1] / vm.stack[vm.top - 2];
                vm.top--;
                break;
            case Opcode.OP_MOD:
                vm.stack[vm.top - 2] = vm.stack[vm.top - 1] % vm.stack[vm.top - 2];
                vm.top--;
                break;
            case Opcode.OP_CONST:
                //Get The Operand
                var operand_index = vm.program.code[vm.ip];
                vm.ip++;
                var constant = vm.program.constants[operand_index];
                vm.stack[vm.top] = constant;
                vm.top++;
                break;
            //next byte is constant
            default:
                throw new Error("Unrecognized opcode: ".concat(opcode));
        }
    }
    return vm.stack[vm.top];
}
exports.runProgram = runProgram;
