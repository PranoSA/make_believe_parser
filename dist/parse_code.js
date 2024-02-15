"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Opcode = exports.Program = exports.Parser = void 0;
var lexer_1 = require("./lexer");
var buffer_1 = require("buffer");
/*interface Program  {
    code : Buffer,
    constants : number[],
    constant_top : number,
    current_code_index : number,
}*/
var Program = /** @class */ (function () {
    function Program() {
        this.code = buffer_1.Buffer.alloc(25, 0xFF);
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
exports.Program = Program;
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
    Opcode[Opcode["OP_FACTORIAL"] = 8] = "OP_FACTORIAL";
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
    Parser.prototype.previousSymbolPrecedence = function () {
        var token = this.program[this.current_token];
        return this.precedence[token.value];
    };
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
        //this.parseExpression(DEFAULT_PE)
        this.parseExpression(DEFAULT_PRECEDENCE["+"]); //Stop When Get to the Precedence of "+"
        this.bytecode.emitBytes(Opcode.OP_ADD);
        // -> Goes to parsePrecedence, which will 
        // 
    };
    Parser.prototype.subExpression = function () {
        // Emit the Sub Bytecode, Enum of "OP_SUB"
        this.parseExpression(DEFAULT_PRECEDENCE["-"]); //Finish Parsing until precedence is met 
        this.bytecode.emitBytes(Opcode.OP_SUB);
    };
    Parser.prototype.mulExpression = function () {
        // Emit the Mul Bytecode, Enum of "OP_MUL"
        this.parseExpression(DEFAULT_PRECEDENCE["*"]);
        this.bytecode.emitBytes(Opcode.OP_MUL);
    };
    Parser.prototype.divExpression = function () {
        // Emit the Div Bytecode, Enum of "OP_DIV"
        this.parseExpression(DEFAULT_PRECEDENCE["/"]);
        this.bytecode.emitBytes(Opcode.OP_DIV);
    };
    Parser.prototype.modExpression = function () {
        // Emit the Mod Bytecode, Enum of "OP_MOD"
        this.parseExpression(DEFAULT_PRECEDENCE["%"]);
        this.bytecode.emitBytes(Opcode.OP_MOD);
    };
    Parser.prototype.Number = function () {
        // Emit the Number Bytecode, Enum of "OP_CONST"
        var token = this.program[this.current_token];
        //Essentially , No Lower Precedence
        this.bytecode.emitConstant(parseInt(this.program[this.current_token - 1].value));
    };
    Parser.prototype.parseExpression = function (precedence) {
        this.current_token++; // <- This is the next token to evaluate
        var left = this.program[this.current_token - 1]; //current token
        //console.log(this.current_token);
        // actual suffix operator
        if (left.type === lexer_1.coinTypesValues.const) {
            this.Number();
            //this.current_token++;
        }
        if (left.type === lexer_1.coinTypesValues['+']) {
            this.addExpression();
        }
        if (left.type === lexer_1.coinTypesValues['-']) {
            this.subExpression();
        }
        if (left.type === lexer_1.coinTypesValues['*']) {
            this.mulExpression();
        }
        if (left.type === lexer_1.coinTypesValues['/']) {
            this.divExpression();
        }
        if (left.type === lexer_1.coinTypesValues['%']) {
            this.modExpression();
        }
        if (left.type === lexer_1.coinTypesValues['(']) {
            this.expression();
        }
        if (left.type === lexer_1.coinTypesValues[')']) {
            this.parseExpression(this.precedence[left.value]);
        }
        //this.current_token++;
        if (this.current_token >= this.program.length) {
            return left;
        }
        var next_token = this.program[this.current_token];
        if (this.current_token >= this.program.length) {
            return left;
        }
        while (precedence < this.precedence[this.program[this.current_token].value]) {
            if (this.current_token >= this.program.length) {
                return left;
            }
            this.current_token++;
            // Now Call the Infix Rule 
            if (next_token.value === "+") {
                this.addExpression();
            }
            if (next_token.value === "-") {
                this.subExpression();
            }
            if (next_token.value === "*") {
                this.mulExpression();
            }
            if (next_token.value === "/") {
                this.divExpression();
            }
            if (next_token.value === "%") {
                this.modExpression();
            }
            if (next_token.value === "(") {
                this.expression();
            }
            if (next_token.value === ")") {
                this.parseExpression(this.precedence[next_token.value]);
            }
            next_token = this.program[this.current_token];
            if (this.current_token >= this.program.length) {
                return left;
            }
        }
        return left;
    };
    return Parser;
}());
exports.Parser = Parser;
