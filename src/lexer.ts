enum coinTypesValues {
    "+",
    "-", 
    "*",
    "/",
    "%",
    "(",
    ")" ,
    "const",
    "EOF"  ,
    "log",
    "exp",
    "!"
 }

type SourceCode = {
    code : string,
}

type Token = {
    type : coinTypesValues,
    value : string,
}

/**

Take The Program And Turn Into a List of Tokens
*/

function Lexer(program:string):Token[] {
    const tokens:Token[] = [];
    let current = 0;
    let char = program[current];
    while (current < program.length) {
        //See if Log
        if (program.slice(current,3) === "log"){
            tokens.push({ type: coinTypesValues["log"], value: "log" });
            current+=3;
            char = program[current];
            continue;
        }
        //See if Exp, if ^ followed by a number, consume ^ and the number
        // if not followed by a number, then syntax error
        if (char === "^"){
            //Consume the ^ and go to the number
            current ++;
            let value = "";
            while (/[0-9]/.test(program[current])){
                value += program[current];
                current++;
            }
            if (value === ""){
                throw new Error(`Unrecognized token: ^`);
            }
            tokens.push({ type: coinTypesValues["exp"], value });
        }


        if (char === " " || char === "\t" || char === "\n" || char === "\r") {
            current++;
            char = program[current];
            continue;
        }
        if (char == "("){
            tokens.push({ type: coinTypesValues["("], value: char });
            current++;
            char = program[current];
            continue;
        }
        if (char == ")"){
            tokens.push({ type: coinTypesValues[")"], value: char });
            current++;
            char = program[current];
            continue;
        }

        if (char == "+"){
            tokens.push({ type: coinTypesValues["+"], value: char });
            current++;
            char = program[current];
            continue;
        }

        if (char == "-"){
            tokens.push({ type: coinTypesValues["-"], value: char });
            current++;
            char = program[current];
            continue;
        }

        if (char == "*"){
            tokens.push({ type: coinTypesValues["*"], value: char });
            current++;
            char = program[current];
            continue;
        }

        if (char == "/"){
            tokens.push({ type: coinTypesValues["/"], value: char });
            current++;
            char = program[current];
            continue;
        }

        if (char == "%"){
            tokens.push({ type: coinTypesValues["%"], value: char });
            current++;
            char = program[current];
            continue;
        }
        if (char == "!"){
            tokens.push({ type: coinTypesValues["!"], value: char });
            current++;
            char = program[current];
            continue;
        }
        

        if (/[0-9]/.test(char)) {
            let value = "";
            while (/[0-9]/.test(char)) {
                value += char;
                current++;
                char = program[current];
            }
            tokens.push({ type: coinTypesValues["const"], value });
            continue;
        }

        throw new Error(`Unrecognized token: ${char}`);
    }
    return tokens;
}

export type { SourceCode, Token };

export { Lexer, coinTypesValues };