const fs = require("node:fs");
const readline = require("node:readline");
const FILENAME = "input";

function diff(a, b) {
	return Math.abs(a - b);
}

(async function main (){
	const stream = fs.createReadStream(FILENAME);
	const rl = readline.createInterface({
		input: stream,
		crlfDelay: Infinity
	});

	let total = 0;
	let mul_enabled = true;
	for await (const line of rl) {
		// regex really is magic
		for (a of line.matchAll(/mul\([0-9]{1,3}\,[0-9]{1,3}\)|do\(\)|don\'t\(\)/g)) {
			/** @type(string) */
			let str = a[0];
			if (str === "do()") mul_enabled = true;
			else if (str === "don't()") mul_enabled = false;
			else if (mul_enabled) {
				let values = str.substring(4, str.length - 1).split(",").map(a => +a);
				total += values[0] * values[1];
			}
		}
	}
	console.log("total:", total);
})();
