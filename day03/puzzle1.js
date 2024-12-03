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
	for await (const line of rl) {
		for (a of line.matchAll(/mul\([0-9]{1,3}\,[0-9]{1,3}\)/g)) {
			/** @type(string) */
			let str = a[0];
			let values = str.substring(4, str.length - 1).split(",").map(a => +a);
			total += values[0] * values[1];
		}
	}
	console.log("total:", total);
})();
