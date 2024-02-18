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
    string_representation : tokens.map((token) => token.value).join(""),
    matching_string : tokens.map((token) => token.value).join(""),
}

const precedenceAdjuster:PrecedenceArgument = {
    "%_precedence" : 0,
    "+_precedence" : 1,
    "-_precedence" : 1,
    "*_precedence" : 2,
    "/_precedence" : 2,
}

const precendenceLevels = PrecedenceLevels(precedenceAdjuster);

const ParseTree = ParseNode(StartingNode, precedenceAdjuster);

console.log(ParseTree);


const next_program = "1+2*3+4";

const next_tokens = Lexer(next_program);

const next_StartingNode:ParseTreeBranch = {
    current_expression : next_tokens,
    children : [],
    operator : "",
    grammar_rule_depth : 0,
    string_representation : next_tokens.map((token) => token.value).join(""),
    matching_string : next_tokens.map((token) => token.value).join(""),
}


const next_ParseTree = ParseNode(next_StartingNode, precedenceAdjuster);

console.log(next_ParseTree);

const par_program = "1+(2*3)+4";

const par_tokens = Lexer(par_program);

const par_StartingNode:ParseTreeBranch = {
    current_expression : par_tokens,
    children : [],
    operator : "",
    grammar_rule_depth : 0,
    string_representation : par_tokens.map((token) => token.value).join(""),
    matching_string : par_tokens.map((token) => token.value).join(""),
}

const par_ParseTree = ParseNode(par_StartingNode, precedenceAdjuster);

console.log(par_ParseTree);