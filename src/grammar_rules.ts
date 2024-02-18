import { PrecedenceArgument } from "./parse_code";
import { coinTypesValues } from "./lexer";
/**
 * 
 * <expr>     ::= <term> {<addop> <term>}
<term>     ::= <factor> {<mulop> <factor>}
<factor>   ::= <primary> ['^' <factor>] | '!' <factor>
<primary>  ::= <number> | '(' <expr> ')' | '-' <primary>
<addop>    ::= '+' | '-'
<mulop>    ::= '*' | '/'
<number>   ::= <digit> {<digit>}
<digit>    ::= '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
 */

/**
 * 
 *  Generate Levels Of Precendence For Each Operator

 */
function PrecedenceLevels(arg:PrecedenceArgument) : coinTypesValues[][] {
    // Generate Expressions for the grammar

    const precendenceLevels:string[] = [];
    

    // <expr>     ::= <term> {<addop> <term>}
    // Confused by () ->

    //Turn the Precedence Argument into a Map
    const LevelOps : string[][] = [];

    const argmap = new Map<string, {precedence: number}>();
    // populate the Map...
    for (const [key, value] of Object.entries(arg)) {
        argmap.set(key, {precedence: value});
    }
    
    const precedenceSet = new Set<number>();
    for (const [key, value] of argmap.entries()) {
        precedenceSet.add(value.precedence);
    }

    // Now Go through the Precedence Set and Create the LevelOps
    for (const precedence of precedenceSet) {
        const ops:string[] = [];
        for (const [key, value] of argmap.entries()) {
            if (value.precedence === precedence) {
                ops.push(key);
            }
        }
        LevelOps.push(ops);
    }
    //Now Remove Empty Levels from the LevelOps
    const levelsToRemove:number[] = [];
    for (let i = 0; i < LevelOps.length; i++) {
        if (LevelOps[i].length === 0) {
            levelsToRemove.push(i);
        }
    }

    // Sort the array in descending order
    levelsToRemove.sort((a, b) => b - a);

    for (const i of levelsToRemove) {
        LevelOps.splice(i, 1);
    }

    // Now Create the Levels

    const returnLevels:coinTypesValues[][] = [];

    //Now, What I actually Want to do is remove _precedence from the level
    //Or map it to the coinTypesValues
    for (let i = 0; i < LevelOps.length; i++) {
        const level = LevelOps[i].map((v) => {
            switch (v) {
                case "%_precedence":
                    return coinTypesValues["%"];
                case "+_precedence":
                    return coinTypesValues["+"];
                case "-_precedence":
                    return coinTypesValues["-"];
                case "*_precedence":
                    return coinTypesValues["*"];
                case "/_precedence":
                    return coinTypesValues["/"];
                default:
                    return coinTypesValues["EOF"];
            }
        }); //Remove the _precedence from the level
        returnLevels.push(level);
    }

    returnLevels.push([coinTypesValues["const"], coinTypesValues["("]]);
    return returnLevels;
    
}

function BNFGrammarExpressions(arg:PrecedenceArgument) : string[] {
    // Generate Expressions for the grammar

    const grammarRules:string[] = [];

    // <expr>     ::= <term> {<addop> <term>}
    // Confused by () -> 


    /**
    First Find the Precedence of the Operators
    And Then Split By Level, Call them Level1Operators, Level2Operators, Level3Operators, Level4Operators, Level5Operators
    For How many Unique Levels of Precedence are there
    */

    const LevelOps : string[][] = [];

    const argmap = new Map<string, {precedence: number}>();
    // populate the Map...
    for (const [key, value] of Object.entries(arg)) {
        argmap.set(key, {precedence: value});
    }
    
    const precedenceSet = new Set<number>();
    for (const [key, value] of argmap.entries()) {
        precedenceSet.add(value.precedence);
    }

    // Now Go through the Precedence Set and Create the LevelOps
    for (const precedence of precedenceSet) {
        const ops:string[] = [];
        for (const [key, value] of argmap.entries()) {
            if (value.precedence === precedence) {
                ops.push(key);
            }
        }
        LevelOps.push(ops);
    }
    //Now Remove Empty Levels from the LevelOps
    const levelsToRemove:number[] = [];
    for (let i = 0; i < LevelOps.length; i++) {
        if (LevelOps[i].length === 0) {
            levelsToRemove.push(i);
        }
    }

    // Sort the array in descending order
    levelsToRemove.sort((a, b) => b - a);

    for (const i of levelsToRemove) {
        LevelOps.splice(i, 1);
    }

    // Now We have the Final LevelOps To Create Grammar Rules From

    // Now Create Grammar Rules for Each Level

    for (let i = 0; i < LevelOps.length; i++) {
        const level = LevelOps[i].map((v) => v.split("_precedence")[0]); //Remove the _precedence from the level
        const levelName = `Level${i + 1}`;
        grammarRules.push(`<${levelName}> ::= Level${i+2} [ (${level.join(" | ")}) <Level${i+1}> ]*`);
    }

    //Don't Have Negate Yet
    grammarRules.push(`<Level${LevelOps.length + 1}> ::= [ <number> | '(' <expr> ')' |  <primary> ]`);

    return grammarRules;

    // First Grammar Rule Is always 

}


export { BNFGrammarExpressions, PrecedenceLevels };