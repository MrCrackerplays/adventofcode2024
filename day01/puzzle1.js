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

	let left = [];
	let right = [];
	for await (const line of rl) {
		const leftright = line.split("   ");
		left.push(+leftright[0]);
		right.push(+leftright[1]);
	}
	left.sort();
	right.sort();
	let distance = 0;
	left.forEach((val, i) => {
		distance += diff(val, right[i]);
	});
	console.log("total distance:", distance);
})();
