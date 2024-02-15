"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var test_string_1 = "1+2*3";
var test_string_2 = "1*2+3";
var test_string_3 = "1+2*3+4";
var test_string_4 = "1*2+3*4";
var test_string_5 = "1+2*3*4";
var test_string_6 = "1*2+3+4";
var test_string_7 = "1+2*3+4*5";
var test_string_8 = "1*2+3*4+5*6";
var test_table = [
    test_string_1,
    test_string_2,
    test_string_3,
    test_string_4,
    test_string_5,
    test_string_6,
    test_string_7,
    test_string_8,
];
var test_table_expected = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
];
