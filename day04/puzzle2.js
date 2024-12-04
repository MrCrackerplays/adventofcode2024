const fs = require("node:fs");
const readline = require("node:readline");
const FILENAME = "input";


(function main (){
	const data = fs.readFileSync(FILENAME, "utf8").split('\n').slice(0, -1).map((va) => va.split(""));
	const width = data[0].length;
	const height = data.length;

	let counter = 0;

	const check_around = function(x, y) {
		const directions = [
			[1, 1],
			[-1, 1]
		];
		let matches = 0;
		for (let direction of directions) {
			// skip checking A as we know it exists at x,y
			let first = data[y + direction[1]][x + direction[0]];
			let second = data[y + -direction[1]][x + -direction[0]];
			if (first === 'M' && second === 'S' || second === 'M' && first === 'S') matches++;
		}
		if (matches === 2) counter++;
	}

	for (let y = 1; y < height - 1; y++) {
		for (let x = 1; x < width - 1; x++) {
			if (data[y][x] === 'A') check_around(x, y);
		}
	}
	console.log("total found:", counter);
})();
