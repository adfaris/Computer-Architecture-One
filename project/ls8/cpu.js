/**
 * LS-8 v2.0 emulator skeleton code
 */
const LDI = 0b10011001
const PRN = 0b01000011
const HLT = 0b00000001
const MUL = 0b10101010
const DIV = 0b10101011
const ADD = 0b10101111
const SUB = 0b10111111
const INC = 0b10111000
const DEC = 0b01010101
const POP = 0b01001100
const PUSH = 0b01001101
const CMP = 0b10100000
let FL = 0b00000000
const JEQ = 0b01010001
const JMP = 0b01010000
const JNE = 0b01010010
/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {
  /**
     * Initialize the CPU
     */
  constructor (ram) {
    this.ram = ram

    this.reg = new Array(8).fill(0) // General-purpose registers R0-R7
    this.reg[7] = 0xf4
    // Special-purpose registers
    this.PC = 0 // Program Counter
    // this.SP = this.reg.read
  }

  /**
     * Store value in memory address, useful for program loading
     */
  poke (address, value) {
    this.ram.write(address, value)
  }

  /**
     * Starts the clock ticking on the CPU
     */
  startClock () {
    this.clock = setInterval(() => {
      this.tick()
    }, 1) // 1 ms delay == 1 KHz clock == 0.000001 GHz
  }

  /**
     * Stops the clock
     */
  stopClock () {
    clearInterval(this.clock)
  }

  /**
     * ALU functionality
     *
     * The ALU is responsible for math and comparisons.
     *
     * If you have an instruction that does math, i.e. MUL, the CPU would hand
     * it off to it's internal ALU component to do the actual work.
     *
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
  alu (op, regA, regB) {
    switch (op) {
      case 'MUL':
        this.reg[regA] = this.reg[regA] * this.reg[regB]
        break
      case 'DIV':
        this.reg[regA] = this.reg[regA] / this.reg[regB]
        break
      case 'ADD':
        this.reg[regA] = this.reg[regA] + this.reg[regB]
        break
      case 'SUB':
        this.reg[regA] = this.reg[regA] - this.reg[regB]
        break
      case 'INC':
        this.reg[regA] += 1
        break
      case 'DEC':
        this.reg[regA] -= 1
        break
      case 'CMP':
        // if (this.reg[regA] > this.reg[regB]) {
        //   FL = FL | 0b0000100
        //   console.log(this.FL.toString(2))
        // } else if (this.reg[regA] < this.reg[regB]) {
        //   FL = FL & 0b000000
        //   FL = FL | 0b00000010
        //   console.log(this.FL)
        if (this.reg[regA] === this.reg[regB]) {
          FL = FL & 0b0000000 // reset FL
          FL = FL | 0b0000001 // set FL
          console.log(this.FL)
        }
        break
    }
  }

  /**
     * Advances the CPU one cycle
     */
  tick () {
    // Load the instruction register (IR--can just be a local variable here)
    // from the memory address pointed to by the PC. (I.e. the PC holds the
    // index into memory of the instruction that's about to be executed
    // right now.)
    const IR = this.ram.read(this.PC)
    // Debugging output
    // console.log(`${this.PC}: ${IR.toString(2)}`)
    // Get the two bytes in memory _after_ the PC in case the instruction
    // needs them.
    const operandA = this.ram.read(this.PC + 1)
    // console.log(operandA, 'OP-A')

    const operandB = this.ram.read(this.PC + 2)
    // console.log(operandB, 'OP-B')
    // Execute the instruction. Perform the actions for the instruction as
    // outlined in the LS-8 spec.
    switch (IR) {
      case LDI:
        this.reg[operandA] = operandB
        // this.PC += 3
        break
      case MUL:
        // this.reg[operandA] = this.reg[operandA] * this.reg[operandB]
        this.alu('MUL', operandA, operandB)
        break
      case DIV:
        // this.reg[operandA] = this.reg[operandA] * this.reg[operandB]
        this.alu('DIV', operandA, operandB)
        break
      case ADD:
        // this.reg[operandA] = this.reg[operandA] * this.reg[operandB]
        this.alu('ADD', operandA, operandB)
        break
      case SUB:
        // this.reg[operandA] = this.reg[operandA] * this.reg[operandB]
        this.alu('SUB', operandA, operandB)
        break

      case CMP:
        this.alu('CMP', operandA, operandB)
        break

      case INC:
        // this.reg[operandA] = this.reg[operandA] * this.reg[operandB]
        this.alu('INC', operandA)
        break
      case DEC:
        // this.reg[operandA] = this.reg[operandA] * this.reg[operandB]
        this.alu('DEC', operandA)
        break

      case PRN:
        console.log(this.reg[operandA])
        // this.PC += 2
        break

      case PUSH:
        this.reg[7]--
        this.ram.write(this.reg[7], this.reg[operandA])
        // this.reg[operandB] = this.reg[operandB]
        break

      case POP:
        this.reg[operandA] = this.ram.read(this.reg[7])
        this.reg[7]++
        break

      case JMP:
        this.reg[operandA] = this.PC
        break

      case JEQ:
        if (FL === 0b0000001) {
          // JMP(this.reg[operandA])
        }
        break

      case JNE:
        if (FL === 0b00000000) {
          // JMP(this.reg[operandA])
        }
        break

      case HLT:
        this.stopClock()
        break

      default:
        console.log(`error at ${this.PC} : ${IR.toString(2)}`)
        this.stopClock()
    }
    // Increment the PC register to go to the next instruction. Instructions
    // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
    // instruction byte tells you how many bytes follow the instruction byte
    // for any particular instruction.
    const move = (IR >> 6) + 1

    this.PC += move
    // console.log(move, 'Move')
  }
}

module.exports = CPU
