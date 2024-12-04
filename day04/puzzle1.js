const fs = require("node:fs");
const readline = require("node:readline");
const FILENAME = "input";


(function main (){
	const data = fs.readFileSync(FILENAME, "utf8").split('\n').slice(0, -1).map((va) => va.split(""));
	const width = data[0].length;
	const height = data.length;
	const word = "XMAS";

	let counter = 0;

	const check_around = function(x, y) {
		const directions = [
			[1, 0],
			[1, 1],
			[0, 1],
			[-1, 1],
			[-1, 0],
			[-1, -1],
			[0, -1],
			[1, -1]
		];
		for (let direction of directions) {
			// too far left/up to go that direction
			if ((direction[0] < 0 && x < word.length - 1) || (direction[1] < 0 && y < word.length - 1)) continue;
			// too far right/down to go that direction
			if ((direction[0] > 0 && x > width - word.length) || (direction[1] > 0 && y > height - word.length)) continue;
			let not_found = false;
			// skip checking X as we know it exists at x,y
			for (let i = 1; i < word.length; i++) {
				if (data[y + (direction[1] * i)][x + (direction[0] * i)] !== word.charAt(i)) {
					not_found = true;
					break;
				}
			}
			if (!not_found) counter++;
		}
	}

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (data[y][x] === 'X') check_around(x, y);
		}
	}
	console.log("total found:", counter);
})();
