"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Opcode = exports.Parser = void 0;
var lexer_1 = require("./lexer");
/*interface Program  {
    code : Buffer,
    constants : number[],
    constant_top : number,
    current_code_index : number,
}*/
var Program = /** @class */ (function () {
    function Program() {
        this.code = Buffer.alloc(25, 0xFF);
        this.constants = [];
        this.constant_top = 0;
        this.current_code_index = 0;
    }
    Program.prototype.emitBytes = function () {
        var bytes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            bytes[_i] = arguments[_i];
        }
        for (var _a = 0, bytes_1 = bytes; _a < bytes_1.length; _a++) {
            var byte = bytes_1[_a];
            this.code.writeUInt8(byte, this.current_code_index);
            this.current_code_index++;
        }
    };
    Program.prototype.emitConstant = function (constant) {
        //Push the constant to constants array
        // Emit The Index of the constant
        var index = this.constant_top;
        this.constants[index] = constant;
        this.constant_top++;
        this.emitBytes(0x05, index);
    };
    return Program;
}());
var Opcode;
(function (Opcode) {
    Opcode[Opcode["OP_ADD"] = 0] = "OP_ADD";
    Opcode[Opcode["OP_SUB"] = 1] = "OP_SUB";
    Opcode[Opcode["OP_MUL"] = 2] = "OP_MUL";
    Opcode[Opcode["OP_DIV"] = 3] = "OP_DIV";
    Opcode[Opcode["OP_MOD"] = 4] = "OP_MOD";
    Opcode[Opcode["OP_CONST"] = 5] = "OP_CONST";
    Opcode[Opcode["OP_EXP"] = 6] = "OP_EXP";
    Opcode[Opcode["OP_LOG"] = 7] = "OP_LOG";
})(Opcode || (exports.Opcode = Opcode = {}));
/**
    Precedence Operators for basic arithmetic operations

    *
    /
    +
    -
    (

    )
    %
*/
var DEFAULT_PRECEDENCE = {
    "expression": 0,
    "*": 3,
    "/": 3,
    "+": 2,
    "-": 2,
    "(": 1,
    ")": 1,
    "%": 3,
    "exp": 4,
    "log": 4,
};
var Parser = /** @class */ (function () {
    function Parser(program, arg, current_token) {
        this.AST = {
            type: "root",
            value: "root",
            left: undefined,
            right: undefined,
        };
        this.program = program;
        this.precedence = DEFAULT_PRECEDENCE;
        this.current_token = current_token;
        this.bytecode = new Program();
        if (arg["%_precedence"] !== undefined) {
            this.precedence["%"] = arg["%_precedence"];
        }
        if (arg["*_precedence"] !== undefined) {
            this.precedence["*"] = arg["*_precedence"];
        }
        if (arg["/_precedence"] !== undefined) {
            this.precedence["/"] = arg["/_precedence"];
        }
        if (arg["+_precedence"] !== undefined) {
            this.precedence["+"] = arg["+_precedence"];
        }
        if (arg["-_precedence"] !== undefined) {
            this.precedence["-"] = arg["-_precedence"];
        }
        if (arg["exp_precedence"] !== undefined) {
            this.precedence["exp"] = arg["exp_precedence"];
        }
        if (arg["log_precedence"] !== undefined) {
            this.precedence["log"] = arg["log_precedence"];
        }
    }
    // Start Looking for the EOF token
    Parser.prototype.beginParsing = function () {
        var token = this.program[this.current_token];
        this.expression();
    };
    Parser.prototype.expression = function () {
        // begin parsePrecedence with lowest precedence
        this.parseExpression(DEFAULT_PRECEDENCE.expression);
    };
    Parser.prototype.addExpression = function () {
        // Emit the Add Bytecode, Enum of "OP_ADD"
        this.current_token++;
        this.parseExpression(DEFAULT_PRECEDENCE["+"]);
        this.bytecode.emitBytes(Opcode.OP_ADD);
    };
    Parser.prototype.subExpression = function () {
        // Emit the Sub Bytecode, Enum of "OP_SUB"
        this.current_token++;
        this.parseExpression(DEFAULT_PRECEDENCE["-"]); //Finish Parsing until precedence is met 
        this.bytecode.emitBytes(Opcode.OP_SUB);
    };
    Parser.prototype.mulExpression = function () {
        this.current_token++;
        // Emit the Mul Bytecode, Enum of "OP_MUL"
        this.parseExpression(DEFAULT_PRECEDENCE["*"]);
        this.bytecode.emitBytes(Opcode.OP_MUL);
    };
    Parser.prototype.divExpression = function () {
        this.current_token++;
        // Emit the Div Bytecode, Enum of "OP_DIV"
        this.parseExpression(DEFAULT_PRECEDENCE["/"]);
        this.bytecode.emitBytes(Opcode.OP_DIV);
    };
    Parser.prototype.modExpression = function () {
        this.current_token++;
        // Emit the Mod Bytecode, Enum of "OP_MOD"
        this.parseExpression(DEFAULT_PRECEDENCE["%"]);
        this.bytecode.emitBytes(Opcode.OP_MOD);
    };
    Parser.prototype.Number = function () {
        // Emit the Number Bytecode, Enum of "OP_CONST"
        var token = this.program[this.current_token];
        this.bytecode.emitConstant(parseInt(token.value));
    };
    Parser.prototype.parseExpression = function (precedence) {
        var left = this.program[this.current_token];
        // If the token is a number, emit the constant
        if (left.type === lexer_1.coinTypesValues.const) {
            this.Number();
            this.current_token++;
        }
        //At the End of the program?? 
        if (this.current_token >= this.program.length) {
            return left;
        }
        //This is the Left Side of the Expression
        //
        //Emit Bytes ??
        var token = this.program[this.current_token];
        var infex_operator = token.value;
        // No Way It Should Be a Number 
        // Now Cal The Infix Operator ???
        // Now Call the function based on the token
        if (infex_operator === "+") {
            this.addExpression();
        }
        if (infex_operator === "-") {
            this.subExpression();
        }
        if (infex_operator === "*") {
            this.mulExpression();
        }
        if (infex_operator === "/") {
            this.divExpression();
        }
        if (infex_operator === "%") {
            this.modExpression();
        }
        if (infex_operator === "(") {
            this.expression();
        }
        if (infex_operator === ")") {
            this.parseExpression(this.precedence[infex_operator]);
        }
        //Check if Finished the Program On Parse
        if (this.current_token >= this.program.length) {
            return left;
        }
        //What is the precendece we are testing ???
        while (precedence < this.precedence[this.program[this.current_token].value]) {
            this.current_token++;
            token = this.program[this.current_token];
            // Now Call the function based on the token
            if (token.value === "+") {
                this.addExpression();
            }
            if (token.value === "-") {
                this.subExpression();
            }
            if (token.value === "*") {
                this.mulExpression();
            }
            if (token.value === "/") {
                this.divExpression();
            }
            if (token.value === "%") {
                this.modExpression();
            }
            if (token.value === "(") {
                this.expression();
            }
            if (token.value === ")") {
                this.parseExpression(this.precedence[token.value]);
            }
            this.parseExpression(this.precedence[token.value]);
        }
        return left;
    };
    return Parser;
}());
exports.Parser = Parser;
