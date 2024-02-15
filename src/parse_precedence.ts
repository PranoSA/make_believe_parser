

type PrecedenceList = {
    [key: string]: number;
};

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

const DEFAULT_PRECEDENCE: PrecedenceList = {
    "*": 3,
    "/": 3,
    "+": 2,
    "-": 2,
    "(": 1,
    ")": 1,
    "%": 3,
    "!" : 1,
};

//export type { PrecedenceList };
//export { DEFAULT_PRECEDENCE };