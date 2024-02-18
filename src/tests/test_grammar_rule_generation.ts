import {BNFGrammarExpressions, PrecedenceLevels} from "../grammar_rules";
import { coinTypesValues } from "../lexer";
import {PrecedenceArgument} from "../parse_code";

const arg:PrecedenceArgument = {
    "%_precedence" : 0,
    "+_precedence" : 1,
    "-_precedence" : 1,
    "*_precedence" : 2,
    "/_precedence" : 2,
}

// I should Change it so Exp and Log are not part of this
// Log and Exp Should always be a function with 2 arguments
//  IT shold be log ::= ( <expr> , <expr> )


const grammarRules = BNFGrammarExpressions(arg);

console.log(grammarRules);

grammarRules.forEach((rule) => { console.log(rule); });


// Now Try the PrecedenceLevels operations

const levels = PrecedenceLevels(arg);

console.log(levels);

levels.forEach((level) => { console.log(level); });

levels.forEach((level) =>  console.log(level.map((v) => coinTypesValues[v] )));
