import { Token } from "./lexer";


const test_string_1 = "1+2*3";
const test_string_2 = "1*2+3";

const test_string_3 = "1+2*3+4";
const test_string_4 = "1*2+3*4";
const test_string_5 = "1+2*3*4";

const test_string_6 = "1*2+3+4";

const test_string_7 = "1+2*3+4*5";

const test_string_8 = "1*2+3*4+5*6";

const test_table : string[] = [
    test_string_1,
    test_string_2,
    test_string_3,
    test_string_4,
    test_string_5,
    test_string_6,
    test_string_7,
    test_string_8,
];

const test_table_expected : Token[][] = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
];