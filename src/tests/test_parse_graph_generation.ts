import {ParseTreeBranch} from '../parsing_graph_edition'
import {ParseNode} from '../parsing_graph_edition'
import { Lexer } from '../lexer'
import { PrecedenceLevels } from '../grammar_rules';
import { PrecedenceArgument } from '../parse_code';

//Create TOkens for the Expression
const program = "1+2*3";
const tokens = Lexer(program);


const StartingNode:ParseTreeBranch = {
    current_expression : tokens,
    children : [],
    operator : "",
    grammar_rule_depth : 0,
}

const precedenceAdjuster:PrecedenceArgument = {
    "%_precedence" : 0,
    "+_precedence" : 1,
    "-_precedence" : 1,
    "*_precedence" : 2,
    "/_precedence" : 2,
}

const precendenceLevels = PrecedenceLevels(precedenceAdjuster);

const ParseTree = ParseNode(StartingNode, precendenceLevels);

console.log(ParseTree);
