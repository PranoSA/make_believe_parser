import { Token } from './lexer';
import { coinTypesValues } from './lexer';
import { Buffer} from 'buffer';



interface Parser  {
    program: Token[];
    precedence: PrecedenceList;
    current_token : number,
    ast : AST,
    bytecode : Program,
}

/*interface Program  {
    code : Buffer,
    constants : number[],
    constant_top : number,
    current_code_index : number,
}*/

class Program {
    code : Buffer;
    constants : number[];
    constant_top : number;
    current_code_index : number;
    constructor(){
        this.code = Buffer.alloc(25, 0xFF);
        this.constants = [];
        this.constant_top = 0;
        this.current_code_index = 0;
    }

    emitBytes(...bytes:number[]){
        for(const byte of bytes){
            this.code.writeUInt8(byte, this.current_code_index);
            this.current_code_index++;
        }
    }

    emitConstant(constant:number){
        //Push the constant to constants array
        // Emit The Index of the constant
        const index = this.constant_top;
        this.constants[index] = constant;
        this.constant_top++;
        this.emitBytes(0x05, index);
    }
}

type PrecedenceArgument = {
    "%_precedence"? : number|undefined,
    "*_precedence"? : number|undefined,
    "/_precedence"? : number|undefined,
    "+_precedence"? : number|undefined,
    "-_precedence"? : number|undefined,
    "exp_precedence"? : number|undefined,
    "log_precedence"? : number|undefined,
}

type PrecedenceList = {
    [key: string]: number;
};

type AST = {
    type : string,
    value : string,
    left : AST|undefined,
    right : AST|undefined,
}

enum Opcode {
    OP_ADD = 0x00,
    OP_SUB = 0x01,
    OP_MUL = 0x02,
    OP_DIV = 0x03,
    OP_MOD = 0x04,
    OP_CONST = 0x05,
    OP_EXP = 0x06,
    OP_LOG = 0x07,
    OP_FACTORIAL = 0x08,
}

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

const DEFAULT_PRECEDENCE: PrecedenceList = {
    "expression" : 0,
    "*": 3,
    "/": 3,
    "+": 2,
    "-": 2,
    "(": 1,
    ")": 1,
    "%": 3,
    "exp" : 4,
    "log" : 4,
};



class Parser {
    program: Token[];
    precedence: PrecedenceList;
    current_token : number;
    AST : AST;
    bytecode : Program;
    constructor(program:Token[], arg: PrecedenceArgument, current_token:number){
        this.AST = {
            type : "root",
            value : "root",
            left : undefined,
            right : undefined,
        };

        this.program = program;
        //let DEFAULT_PRECEDENCE_COPY = JSON.parse(JSON.stringify(DEFAULT_PRECEDENCE));
        this.precedence = DEFAULT_PRECEDENCE;
        this.current_token = current_token;
        this.bytecode = new Program();

    
        if(arg["%_precedence"] !== undefined){
            this.precedence["%"] = arg["%_precedence"];
        }
    
        if(arg["*_precedence"] !== undefined){
            this.precedence["*"] = arg["*_precedence"];
        }
    
        if(arg["/_precedence"] !== undefined){
            this.precedence["/"] = arg["/_precedence"];
        }
    
        if(arg["+_precedence"] !== undefined){
            this.precedence["+"] = arg["+_precedence"];
        }
        if (arg["-_precedence"] !== undefined){
            this.precedence["-"] = arg["-_precedence"];
        }
        if(arg["exp_precedence"] !== undefined){
            this.precedence["exp"] = arg["exp_precedence"];
        }
        if(arg["log_precedence"] !== undefined){
            this.precedence["log"] = arg["log_precedence"];
        }
    }

    // Start Looking for the EOF token
    previousSymbolPrecedence(){
        let token = this.program[this.current_token];
        return this.precedence[token.value];
    }

    beginParsing(){
        let token = this.program[this.current_token];
        this.expression();
    }

    expression(){
        // begin parsePrecedence with lowest precedence
        this.parseExpression(DEFAULT_PRECEDENCE.expression);
    }

    addExpression(){
        // Emit the Add Bytecode, Enum of "OP_ADD"

        //this.parseExpression(DEFAULT_PE)
        this.parseExpression(DEFAULT_PRECEDENCE["+"]); //Stop When Get to the Precedence of "+"
        this.bytecode.emitBytes(Opcode.OP_ADD);
        // -> Goes to parsePrecedence, which will 
        // 
        
    }

    subExpression(){
        // Emit the Sub Bytecode, Enum of "OP_SUB"
        this.parseExpression(DEFAULT_PRECEDENCE["-"]); //Finish Parsing until precedence is met 
        this.bytecode.emitBytes(Opcode.OP_SUB);
    }

    mulExpression(){
        // Emit the Mul Bytecode, Enum of "OP_MUL"
        this.parseExpression(DEFAULT_PRECEDENCE["*"]);
        this.bytecode.emitBytes(Opcode.OP_MUL);
    }

    divExpression(){
        // Emit the Div Bytecode, Enum of "OP_DIV"
        this.parseExpression(DEFAULT_PRECEDENCE["/"]);
        this.bytecode.emitBytes(Opcode.OP_DIV);
    }

    modExpression(){
        // Emit the Mod Bytecode, Enum of "OP_MOD"
        this.parseExpression(DEFAULT_PRECEDENCE["%"]);
        this.bytecode.emitBytes(Opcode.OP_MOD);
    }

    Number(){
        // Emit the Number Bytecode, Enum of "OP_CONST"
        let token = this.program[this.current_token];
        
        //Essentially , No Lower Precedence
        this.bytecode.emitConstant(parseInt(this.program[this.current_token-1].value));
    }

    parseExpression(precedence:number) {
        this.current_token++; // <- This is the next token to evaluate
        let left = this.program[this.current_token-1]; //current token
        //console.log(this.current_token);
        
        // actual suffix operator

        if (left.type === coinTypesValues.const){
            this.Number();
            //this.current_token++;
        }

        if(left.type === coinTypesValues['+']){
            this.addExpression();
        }

        if(left.type === coinTypesValues['-']){
            this.subExpression();
        }

        if(left.type === coinTypesValues['*']){
            this.mulExpression();
        }

        if(left.type === coinTypesValues['/']){
            this.divExpression();
        }

        if(left.type === coinTypesValues['%']){
            this.modExpression();
        }

        if(left.type === coinTypesValues['(']){
            this.expression();
        }

        if(left.type === coinTypesValues[')']){
            this.parseExpression(this.precedence[left.value]);
        }

        //this.current_token++;
        if(this.current_token >= this.program.length){
            return left;
        }

        let next_token = this.program[this.current_token];

        if(this.current_token >= this.program.length){
            return left;
        }

        while (precedence < this.precedence[this.program[this.current_token].value]){
            
            if (this.current_token >= this.program.length){
                return left;
            }

            this.current_token++;
            // Now Call the Infix Rule 
            if(next_token.value === "+"){
                this.addExpression();
            }
            if(next_token.value === "-"){
                this.subExpression();
            }
            if(next_token.value === "*"){
            
                this.mulExpression();
            }
            if(next_token.value === "/"){
                this.divExpression();
            }
            if(next_token.value === "%"){
                this.modExpression();
            }
            if(next_token.value === "("){
                this.expression();
            }
            if(next_token.value === ")"){
                this.parseExpression(this.precedence[next_token.value]);
                
            }
            next_token = this.program[this.current_token];

            if(this.current_token >= this.program.length){
                return left;
            }
            
        }
    
        return left;
    }

}

/*
    Input : Take In a program "Token []" and return a Program
*/


/**
Now we want to both emit "Fake Bytecode" as well as an AST of operations based on precedence
using a pratt this
*/



export type { AST, PrecedenceArgument,PrecedenceList, };
export { Parser,   Program, Opcode};