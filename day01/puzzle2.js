const fs = require("node:fs");
const readline = require("node:readline");
const FILENAME = "input";


(async function main (){
	const stream = fs.createReadStream(FILENAME);
	const rl = readline.createInterface({
		input: stream,
		crlfDelay: Infinity
	});

	let similarity = 0;

	/** @type(Map<number, number>) */
	let left = new Map();
	/** @type(Map<number, number>) */
	let right = new Map();
	for await (const line of rl) {
		const leftright = line.split("   ");
		left.set(+leftright[0], (left.get(+leftright[0]) | 0) + 1);
		right.set(+leftright[1], (right.get(+leftright[1]) | 0) + 1);
	}
	left.forEach((occurances, number) => {
		similarity += occurances * (number * (right.get(number) | 0));
	})
	console.log("total similarity:", similarity);
})();
