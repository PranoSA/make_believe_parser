import { ASTBranch } from "./vm";
import { PrecedenceArgument , PrecedenceList} from "./parse_code";
import { Token, coinTypesValues } from "./lexer";

/**
For Now, I am Only Got To Build a Graph, Rather than Actually Dumping the ByteCode
For The Engine

That Will Be Left to the Pratt Parser
*/

//set Default Precedence List 
const defaultPrecedenceList:PrecedenceList = {
    "%_precedence" : 0,
    "+_precedence" : 1,
    "-_precedence" : 1,
    "*_precedence" : 2,
    "/_precedence" : 2,
    "exp_precedence" : 3,
    'log_precedence' : 3,
}

// Grammar Rule Depth 
//  If you match (expr) (inside quotes) -> Go Back to the 1st Level
// And Dive Down Again 

type ParseTreeBranch = {
   current_expression : Token[],
   children:ParseTreeBranch[], //Since Root May Have Multiple Children
   operator:string,
   grammar_rule_depth:number,
}

// How do I do This -> I Need to know current precedence
// To Then Work My Way Down to the lower levels 

const StartingNode:ParseTreeBranch = {
    current_expression : [],
    children : [],
    operator : "",
    grammar_rule_depth : 0,
}


function consumeParanthese(current_expression:Token[], current_token_parse:number):number{
    //Consume Until the Matching paranthesees
    let paranthese_count = 1;
    current_token_parse++;
    while(paranthese_count > 0){
        if (current_expression[current_token_parse].type === coinTypesValues["("]){
            paranthese_count++;
        }
        if (current_expression[current_token_parse].type === coinTypesValues[")"]){
            paranthese_count--;
        }
        current_token_parse++;
    }
    return current_token_parse;
}

export function ParseNode(branch:ParseTreeBranch, precendenceLevels:coinTypesValues[][]){
    // Use Current Expression To Parse To The Next Level
    
    //if Current grammar_rule_depth is 0, then look at the first level of precedence
    //if Current grammar_rule_depth is 1, then look at the second level of precedence
    //if Current grammar_rule_depth is 2, then look at the third level of precedence
    //if Current grammar_rule_depth is 3,  then look for [number | (expr)] | - <primary>]

    const ChildrenNodes:ParseTreeBranch[] = [];

    if(branch.grammar_rule_depth === 0 ||true){
        //Look at the first level of precedence
        //If you find a match, then create a new branch and parse the next level
        //If you do not find a match, then return the current branch

        // Scan Tokens for the first level of precedence
        //Remember if encounter a ( -> Skip Till the ) and then continue 
        
        //So Now -> Consume Until You Encounter a Token that is in the first level of precedence

        //If We Are Passed the length of precendenceLevels
        if(branch.grammar_rule_depth >= precendenceLevels.length){
            console.log("SOMETHING IS WRONG")
        }

        //Operator Is Not Being Filled Out
        // How DO I Do THis???
        let current_token_parse = 0;
        let last_match = 0;
        while(current_token_parse < branch.current_expression.length){
            // Check if You FInd a Match,
            // Then Create  New Branch and Parse the Next Level
            if(precendenceLevels[branch.grammar_rule_depth].includes(branch.current_expression[current_token_parse].type)){
                //Create a New Branch and Parse the Next Level
                //This crea
                const newBranch:ParseTreeBranch = {
                    current_expression : branch.current_expression.slice(last_match, current_token_parse),
                    children : [],
                    operator : branch.current_expression[current_token_parse].value,
                    grammar_rule_depth : branch.grammar_rule_depth + 1,
                }
                //So What it should Do Instead is to use the [last_match to current_token_parse]
                //And Create a New Childd Based on That -> Unless its 0 ....
                // Then update the current node ...
                branch.operator = branch.current_expression[current_token_parse].value;
                if(newBranch.current_expression.length > 0){
                    ParseNode(newBranch, precendenceLevels);
                    branch.children.push(newBranch);
                }
                else {
                    //You've Reached The Lowest Level, Now Return and Set Current Node
                    //branch.operator = branch.current_expression[current_token_parse].value;
                    return;
                }

                last_match = current_token_parse+1; //Consume the '+, /, *, -' -> Does this Seem Right???
                //Now Parse the Next Level

            }
            //Consume Until the Matching paranthesees
            if (branch.current_expression[current_token_parse].type === coinTypesValues["("]){
                current_token_parse = consumeParanthese(branch.current_expression, current_token_parse);
            }
            else{
                current_token_parse++;
            }
        }

        //Now Just Pass Whats Left to the Next Level
        const newBranch:ParseTreeBranch = {
            current_expression : branch.current_expression.slice(last_match, current_token_parse),
            children : [],
            operator : "",
            grammar_rule_depth : branch.grammar_rule_depth + 1,
        }

        if(newBranch.current_expression.length > 0){
            
            ParseNode(newBranch, precendenceLevels);

            branch.children.push(newBranch);

        }
    }

}



export type {ParseTreeBranch}