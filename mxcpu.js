Number.prototype.mod = function(n) {
  return ((this % n) + n) % n;
};

function print_state(state) {
  print("PC\t\t\t0x" + state.pc.toString(16));
  print("INC\t\t\t0x" + state.inc.toString(16));
  print("ACC\t\t\t0x" + state.acc.toString(16));
  memory = [];
  for (i = 0; i < 16; ++i) { memory[i] = "0x" + state.registers[i].toString(16); }
  print("MEMORY\t\t\t" + memory.join(","));
}

function interpret(program, state) {
  bytes = program.split(/\s+/);

  print ("Running program");
  while (true) {
    state.cycles++;
    if (state.cycles == 1000) throw "Program terminated because it ran too long.  Do you have an infinite loop in your program?";

    operation  = parseInt(bytes[state.pc], 16) % 256;
    operand    = parseInt(bytes[state.pc + 1], 16) % 256;
    operand2   = parseInt(bytes[state.pc + 2], 16) % 256;

    switch (operation) {
      // Jumps / Branch
      case 0xB1:
        state.pc = operand;
        state.pc = state.pc % 256;
        break;
      case 0xB2:
        if (state.registers[operand % 16] == state.acc)
          state.pc = operand2;
        else
          state.pc += 3;
        state.pc = state.pc % 256;
        break;
      case 0xB3:
        if (state.acc == operand) {
          state.pc = operand2;
        } else {
          state.pc += 3;
        }
        state.pc = state.pc % 256;
        break;
      // Accumulator
      case 0xC0:
        state.acc += state.registers[operand % 16];
        state.pc += 2;
        state.acc = state.acc % 256;
        state.pc = state.pc % 256;
        break;
      case 0xC1:
        state.acc += operand;
        state.pc += 2;
        state.acc = state.acc % 256;
        state.pc = state.pc % 256;
        break;
      // Counter
      case 0xC2:
        state.inc++;
        state.pc++;
        state.inc = state.inc % 256;
        state.pc = state.pc % 256;
        break;
      case 0xC3:
        state.inc--;
        state.pc++;
        state.inc = state.inc.mod(256);
        state.pc = state.pc % 256;
        break;
      case 0xC4:
        state.inc = 0;
        state.pc++;
        state.pc = state.pc % 256;
        break;
      case 0xC5:
        state.acc = state.inc;
        state.pc++;
        state.acc = state.acc % 256;
        state.pc = state.pc % 256;
        break;
      case 0xC6:
        state.inc = state.acc;
        state.pc++;
        state.inc = state.inc % 256;
        state.pc = state.pc % 256;
        break;
      // Load / Store
      case 0xD0:
        state.acc = state.registers[operand % 16];
        state.pc += 2;
        state.acc = state.acc % 256;
        state.pc = state.pc % 256;
        break;
      case 0xD1:
        state.acc = operand;
        state.pc += 2;
        state.acc = state.acc % 256;
        state.pc = state.pc % 256;
        break;
      case 0xD2:
        state.registers[operand % 16] = state.acc;
        state.pc += 2;
        state.pc = state.pc % 256;
        break;
      case 0x00:
        print("Terminating");
        return;
      default:
        throw "Illegal op code `0x" + operation.toString(16) + "' at address `0x" + state.pc.toString(16) + "'";
    }
  }
}

state = {
  cycles: 0,
  inc: 0,
  pc: 0,
  acc: 0,
  registers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
};

program = readFile(arguments[0]);
interpret(program, state);

print_state(state);
