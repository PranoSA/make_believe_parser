import { Token } from './lexer';
import { coinTypesValues } from './lexer';



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

        this.current_token++;
        this.parseExpression(DEFAULT_PRECEDENCE["+"]);
        

        this.bytecode.emitBytes(Opcode.OP_ADD);
    }

    subExpression(){
        // Emit the Sub Bytecode, Enum of "OP_SUB"
        this.current_token++;
        this.parseExpression(DEFAULT_PRECEDENCE["-"]); //Finish Parsing until precedence is met 
        this.bytecode.emitBytes(Opcode.OP_SUB);
    }

    mulExpression(){
        this.current_token++;
        // Emit the Mul Bytecode, Enum of "OP_MUL"
        this.parseExpression(DEFAULT_PRECEDENCE["*"]);
        this.bytecode.emitBytes(Opcode.OP_MUL);
    }

    divExpression(){
        this.current_token++;
        // Emit the Div Bytecode, Enum of "OP_DIV"
        this.parseExpression(DEFAULT_PRECEDENCE["/"]);
        this.bytecode.emitBytes(Opcode.OP_DIV);
    }

    modExpression(){
        this.current_token++;
        // Emit the Mod Bytecode, Enum of "OP_MOD"
        this.parseExpression(DEFAULT_PRECEDENCE["%"]);
        this.bytecode.emitBytes(Opcode.OP_MOD);
    }

    Number(){
        // Emit the Number Bytecode, Enum of "OP_CONST"
        let token = this.program[this.current_token];

        this.bytecode.emitConstant(parseInt(token.value));
    }

    parseExpression(precedence:number) {
        let left = this.program[this.current_token];
        
        // If the token is a number, emit the constant
        if(left.type === coinTypesValues.const){
            this.Number()
            this.current_token++;
        }

        //At the End of the program?? 
        if(this.current_token >= this.program.length){
            return left;
        }

        //This is the Left Side of the Expression
        //

        //Emit Bytes ??

        let token = this.program[this.current_token];

        let infex_operator = token.value;

        // No Way It Should Be a Number 
        
        // Now Cal The Infix Operator ???
        // Now Call the function based on the token
        if(infex_operator === "+"){
            this.addExpression();
        }
        if(infex_operator === "-"){
            this.subExpression();
        }
        if(infex_operator === "*"){
            this.mulExpression();
        }
        if(infex_operator === "/"){
            this.divExpression();
        }

        if(infex_operator === "%"){
            this.modExpression();
        }

        if(infex_operator === "("){
            this.expression();
        }

        if(infex_operator === ")"){
            this.parseExpression(this.precedence[infex_operator]);
        }


        //Check if Finished the Program On Parse
        if(this.current_token >= this.program.length){
            return left;
        }

        //What is the precendece we are testing ???

        while(precedence < this.precedence[this.program[this.current_token].value]){
            this.current_token++;
            console.log(this.current_token);
            token = this.program[this.current_token];
            

            // Now Call the function based on the token
            if(token.value === "+"){
                this.addExpression();

            }
            if(token.value === "-"){
                this.subExpression();
            }
            if(token.value === "*"){
                this.mulExpression();
            }

            if(token.value === "/"){
                this.divExpression();
            }

            if(token.value === "%"){
                this.modExpression();
            }

            if(token.value === "("){
                this.expression();
            }

            if(token.value === ")"){
                this.parseExpression(this.precedence[token.value]);
            }
           this.parseExpression(this.precedence[token.value]);
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



export type { AST, Program};
export { Parser,  PrecedenceList, Opcode, };