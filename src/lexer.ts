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