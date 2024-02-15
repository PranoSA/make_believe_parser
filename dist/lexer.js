"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coinTypesValues = exports.Lexer = void 0;
var coinTypesValues;
(function (coinTypesValues) {
    coinTypesValues[coinTypesValues["+"] = 0] = "+";
    coinTypesValues[coinTypesValues["-"] = 1] = "-";
    coinTypesValues[coinTypesValues["*"] = 2] = "*";
    coinTypesValues[coinTypesValues["/"] = 3] = "/";
    coinTypesValues[coinTypesValues["%"] = 4] = "%";
    coinTypesValues[coinTypesValues["("] = 5] = "(";
    coinTypesValues[coinTypesValues[")"] = 6] = ")";
    coinTypesValues[coinTypesValues["const"] = 7] = "const";
    coinTypesValues[coinTypesValues["EOF"] = 8] = "EOF";
})(coinTypesValues || (exports.coinTypesValues = coinTypesValues = {}));
/**

Take The Program And Turn Into a List of Tokens
*/
function Lexer(program) {
    var tokens = [];
    var current = 0;
    var char = program[current];
    while (current < program.length) {
        if (char === " " || char === "\t" || char === "\n" || char === "\r") {
            current++;
            char = program[current];
            continue;
        }
        if (char == "(") {
            tokens.push({ type: coinTypesValues["("], value: char });
            current++;
            char = program[current];
            continue;
        }
        if (char == ")") {
            tokens.push({ type: coinTypesValues[")"], value: char });
            current++;
            char = program[current];
            continue;
        }
        if (char == "+") {
            tokens.push({ type: coinTypesValues["+"], value: char });
            current++;
            char = program[current];
            continue;
        }
        if (char == "-") {
            tokens.push({ type: coinTypesValues["-"], value: char });
            current++;
            char = program[current];
            continue;
        }
        if (char == "*") {
            tokens.push({ type: coinTypesValues["*"], value: char });
            current++;
            char = program[current];
            continue;
        }
        if (char == "/") {
            tokens.push({ type: coinTypesValues["/"], value: char });
            current++;
            char = program[current];
            continue;
        }
        if (char == "%") {
            tokens.push({ type: coinTypesValues["%"], value: char });
            current++;
            char = program[current];
            continue;
        }
        if (/[0-9]/.test(char)) {
            var value = "";
            while (/[0-9]/.test(char)) {
                value += char;
                current++;
                char = program[current];
            }
            tokens.push({ type: coinTypesValues["const"], value: value });
            continue;
        }
        throw new Error("Unrecognized token: ".concat(char));
    }
    return tokens;
}
exports.Lexer = Lexer;
