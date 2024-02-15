


const ProgramBytes = Buffer.alloc(10000);


/**

Define Bytecode Operations and the Stack Machine

ByteCode Operations include the following:

PUSH_STACK
ADD
SUB
MUL
DIV
MOD
*/

type OP_ADD = 0x00;
type OP_SUB = 0x01;
type OP_MUL = 0x02;
type OP_DIV = 0x03;
type OP_MOD = 0x04;
type OP_PUSH_STACK = 0x05;

