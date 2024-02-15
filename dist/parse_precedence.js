"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PRECEDENCE = void 0;
/**
    Precedence Operators for basic arithmetic operations

    *
    /
    +
    -
    (

    )
    %
*/
var DEFAULT_PRECEDENCE = {
    "*": 3,
    "/": 3,
    "+": 2,
    "-": 2,
    "(": 1,
    ")": 1,
    "%": 3
};
exports.DEFAULT_PRECEDENCE = DEFAULT_PRECEDENCE;
