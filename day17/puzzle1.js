const fs = require("node:fs");
const FILENAME = "input";


(function main () {
	const data = fs.readFileSync(FILENAME, "utf8").slice(0, -1).split('\n');
	let reg_a = +data[0].slice(12);
	let reg_b = +data[1].slice(12);
	let reg_c = +data[2].slice(12);
	/** @type {(0 | 1 | 2 | 3 | 4 | 5 | 6 | 7) []} */
	let program = data[4].slice(9).split(',').map(n => +n);

	let pointer = 0;

	/** @type {(0 | 1 | 2 | 3 | 4 | 5 | 6 | 7) []} */
	let output = []

	let process = function() {
		if (pointer >= program.length) return false;
		let instruction = program[pointer];
		let operand = program[pointer + 1];
		let is_literal = true;
		if ([0, 2, 5, 6, 7].includes(instruction)) is_literal = false;
		let operand_value = operand;
		if (!is_literal) {
			if (operand === 4) operand_value = reg_a;
			else if (operand === 5) operand_value = reg_b;
			else if (operand === 6) operand_value = reg_c;
		}
		let jump = 2;
		if (instruction === 0) {
			reg_a = Math.floor(reg_a / Math.pow(2, operand_value));
		} else if (instruction === 1) {
			reg_b = reg_b ^ operand_value;
		} else if (instruction === 2) {
			reg_b = operand_value % 8;
		} else if (instruction === 3) {
			if (reg_a !== 0) {
				pointer = operand_value;
				jump = 0;
			}
		} else if (instruction === 4) {
			reg_b = reg_b ^ reg_c;
		} else if (instruction === 5) {
			output.push(operand_value % 8);
		} else if (instruction === 6) {
			reg_b = Math.floor(reg_a / Math.pow(2, operand_value));
		} else if (instruction === 7) {
			reg_c = Math.floor(reg_a / Math.pow(2, operand_value));
		}
		pointer += jump;
		return true;
	}

	while (process());

	console.log("output:", output.join());
})();
