import { ASTBranch } from "./vm";
import { PrecedenceArgument , PrecedenceList} from "./parse_code";
import { Token, coinTypesValues } from "./lexer";
import { PrecedenceLevels } from "./grammar_rules";
import { BNFGrammarExpressions } from "./grammar_rules";

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
   string_representation:string,
   matching_string:string,
}

// How do I do This -> I Need to know current precedence
// To Then Work My Way Down to the lower levels 

const StartingNode:ParseTreeBranch = {
    current_expression : [],
    children : [],
    operator : "",
    grammar_rule_depth : 0,
    string_representation : "",
    matching_string : "",
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

export function ParseNode(branch:ParseTreeBranch, precedenceArgs:PrecedenceArgument){
    // Use Current Expression To Parse To The Next Level
    const precendenceLevels:coinTypesValues[][] = PrecedenceLevels(precedenceArgs)
    const matchingStrings:string[] = BNFGrammarExpressions(precedenceArgs);
    
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
                    string_representation :  branch.current_expression.slice(last_match, current_token_parse).map((token) => token.value).join(""),
                    matching_string : ""// precendenceLevels[branch.grammar_rule_depth+1].map((type) => coinTypesValues[type]).join(""),
                    //Matching Rule???
                }
                //So What it should Do Instead is to use the [last_match to current_token_parse]
                //And Create a New Childd Based on That -> Unless its 0 ....
                // Then update the current node ...

                //If Binary Operator, The Left Side Shold Be Parsed at a grammar_rule_depth +1
                //The RIght Side SHould be parsed at the current grammar_rule_depth
                //And then it should return -> It sholdn't add any more children
                //It should just return the current node
                // Check if Binary Operator
                
                if(branch.current_expression[current_token_parse].value === "+" || branch.current_expression[current_token_parse].value === "-" || branch.current_expression[current_token_parse].value === "*" || branch.current_expression[current_token_parse].value === "/"){
                    branch.operator = branch.current_expression[current_token_parse].value;
                    const leftBranch = {
                        current_expression : branch.current_expression.slice(last_match, current_token_parse),
                        children : [],
                        operator : "",
                        grammar_rule_depth : branch.grammar_rule_depth + 1,
                        string_representation :  branch.current_expression.slice(last_match, current_token_parse).map((token) => token.value).join(""),
                        matching_string : matchingStrings[branch.grammar_rule_depth+1]
                    }
                    const rightBranch = {
                        current_expression : branch.current_expression.slice(current_token_parse+1),
                        children : [],
                        operator : "",
                        grammar_rule_depth : branch.grammar_rule_depth,
                        string_representation :  branch.current_expression.slice(current_token_parse+1).map((token) => token.value).join(""),
                        matching_string  : matchingStrings[branch.grammar_rule_depth]
                    }
                    ParseNode(leftBranch, precedenceArgs);
                    ParseNode(rightBranch, precedenceArgs);
                    branch.children.push(leftBranch);
                    branch.children.push(rightBranch);
                    return ;
                }

                //if ("(") -> Then 1 Child -> Split Betwen the Paranthesees
                if(branch.current_expression[current_token_parse].type === coinTypesValues["("]){
                    const child = {
                        current_expression : branch.current_expression.slice(current_token_parse+1),
                        children : [],
                        operator : "",
                        grammar_rule_depth : 0, //Reset to 0 -> Lowest One 
                        string_representation :  branch.current_expression.slice(current_token_parse+1).map((token) => token.value).join(""),
                        matching_string : matchingStrings[branch.grammar_rule_depth+1]
                    }

                    //assert last of child is ")"
                    const last = child.current_expression.pop();

                    if(last?.type !== coinTypesValues[")"]){
                        console.log("Something is Wrong")
                    }

                    ParseNode(child, precedenceArgs);
                    branch.children.push(child);
                    return;
                }

                //If ! for example, it shold only parse a right branch...



                branch.operator = branch.current_expression[current_token_parse].value;
                if(newBranch.current_expression.length > 0){
                    ParseNode(newBranch, precedenceArgs);
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
            string_representation :  branch.current_expression.slice(last_match, current_token_parse).map((token) => token.value).join(""),
            matching_string : precendenceLevels[branch.grammar_rule_depth+1].map((type) => coinTypesValues[type]).join(""),
        }
        

        if(newBranch.current_expression.length > 0){
            
            ParseNode(newBranch, precedenceArgs);

            branch.children.push(newBranch);

        }
    }

}

/*function calculateFromNode(node:ParseTreeBranch):number{
    //The Precendece List is Baked Into The Tree Structure
    //So I Don't Need to Worry About That

    //If the Node is a Leaf, It Should be a 'number'
    //If the Node is a Branch, It Should be an Operator -> or '' - Although this doesn't work yet

    // Check the Operator
    if(node.operator === "+"){
        return calculateFromNode(node.children[0]) + calculateFromNode(node.children[1]);
    }
    if(node.operator === "-"){
        return calculateFromNode(node.children[0]) - calculateFromNode(node.children[1]);
    }
    if(node.operator === "*"){
        return calculateFromNode(node.children[0]) * calculateFromNode(node.children[1]);
    }
    if(node.operator === "/"){
        return calculateFromNode(node.children[0]) / calculateFromNode(node.children[1]);
    }
    if(node.operator.test(/\d+/)){
        return parseInt(node.operator);
    }
}*/



export type {ParseTreeBranch}