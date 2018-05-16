const RAM = require('./ram')
const CPU = require('./cpu')
const fs = require('fs')
const argv = process.argv.slice(2)

// add an error check to check the number of params
if (argv.length !== 1) {
  console.error('usage: [filename]')
  process.exit(1)
}
const filename = `${argv[0]}`

const filedata = fs.readFileSync(filename, 'utf8')
// console.log(filedata, 'asdfasdfasdfasdfasdf')
// const programLines = filedata.trim().split(/[\r\n]+/g)
/**
 * Load an LS8 program into memory
 *
 * TODO: load this from a file on disk instead of having it hardcoded
 */

const programLines = filedata.trim().split(/[\r\n]+/g)

const program = programLines
  .map(line => parseInt(line, 2).toString(2))
  .filter(num => !isNaN(num))
  .map(byte => {
    const len = byte.length

    if (len < 8) {
      for (let i = 0; i < 8 - len; i++) {
        byte = '0' + byte
      }
    }
    return byte
  })

let ram = new RAM(256)
let cpu = new CPU(ram)

program.forEach((code, i) => cpu.poke(i, parseInt(code, 2)))

// function loadMemory () {
//   // Hardcoded program to print the number 8 on the console

//   const program = [
//     // print8.ls8
//     // '10011001', // # LDI R0,8
//     // '00000000',
//     // '00001000',
//     // '10011001', // # LDI R1,9
//     // '00000001',
//     // '00001001',
//     // '10101010', // # MUL R0,R1 <---
//     // '00000000',
//     // '00000001',
//     // '01000011', // # PRN R0
//     // '00000000',
//     // '00000001' // # HLT
//   ]

//   // Load the program into the CPU's memory a byte at a time
//   for (let i = 0; i < program.length; i++) {
//     cpu.poke(i, parseInt(program[i], 2))
//   }
// }

/**
 * Main
 */

// TODO: get name of ls8 file to load from command line

// loadMemory(cpu)

cpu.startClock()
