# MXCPU

Arecibo / MXCPU Billboard Puzzle

## MXCPU Instruction Set

*Note:* The results of all operations are modulo 256 and all memory slot addresses are modulo 16.

| Op-code       | Operand 1     | Operand 2 | Explanation |
| ------------- |:-------------:|:---------:| ----------- |
|B1|byte #|--|Set PC to byte #|
|B2|Memory slot [00-0F]|byte #|If accumulator equals register, jump to byte, otherwise, advance program counter 3 bytes (to next instruction)|
|B3|Value|byte #|If accumulator equals value, jump to byte, otherwise, advance program counter 3 bytes (to next instruction)|
|C0|Memory slot [00-0F]|--|Add memory slot value to accumulator|
|C1|Value to add to accumulator|--|Add value to accumulator|
|C2|--|--|Increment the counter|
|C3|--|--|Decrement the counter|
|C4|--|--|Reset the counter to zero|
|C5|--|--|Copy counter to accumulator|
|C6|--|--|Copy accumulator to counter|
|D0|Memory slot [00-0F]|--|Copy memory slot value to accumulator|
|D1|Value|--|Set accumulator to value|
|D2|Memory slot [00-0F]|--|Store accumulator in memory slot|
|00|--|--|Halt program execution|

## Run

Download a stand-alone JavaScript interpreter such as <a href="https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Rhino">rhino</a>.

Write your program into a file.  For example, to sum the numbers from 1 to 10 and store the result in memory slot 0x00:
```
C4 D1 00 D2 00 C2 C5 B3 0B 10 C0 00 D2 00 B1 05 00
```

Run your program: `$ rhino mxcpu.js myprogram.txt`

```
Running program
Terminating
PC			0x10
INC			0xb
ACC			0xb
MEMORY			0x37,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x3,0x8
```
