const fs = require("node:fs");
const FILENAME = "input";


(function main () {
	const data = fs.readFileSync(FILENAME, "utf8").split('\n').slice(0, -1).map(line => line.split(''));
	const height = data.length;
	const width = data[0].length;
	// y,x
	let guard = [0, 0];
	guard[0] = data.findIndex(l => l.find((v, i) => {
		if (v === '^') {
			guard[1] = i;
			return true;
		}
		else return false;
	}) !== undefined);
	const forbidden = [guard[0], guard[1]];
	const directions = [
		[-1,0],
		[0,1],
		[1,0],
		[0,-1]
	];
	const check_if_loop = function(map_data, guard) {
		/** @type(Map<number, Map<number, number[]>) */
		let turned = new Map();
		for (let i = 0; i < height; i++) {
			turned.set(i, new Map());
		}
		let direction = 0;
		for (let i = 0; i < height * width; i++) {
			let next = map_data[guard[0] + directions[direction][0]]
			if (next === undefined) return false;
			next = next[guard[1] + directions[direction][1]];
			if (next === undefined) return false;
			if (next === '#' || next === 'O') {
				direction++;
				direction %= 4;
				let turns = turned.get(guard[0]).get(guard[1]);
				if (turns) {
					/** if true:
					 * turned in a position where have previously already done that turn
					 * which can only happen if it's already been in that exact situation
					 * thus a loop */
					if (turns.includes(direction)) return true;
					turns.push(direction);
				}
				else turned.get(guard[0]).set(guard[1], [direction]);
			} else {
				guard[0] += directions[direction][0];
				guard[1] += directions[direction][1];
			}
		}
		console.error("somehow went past hard limit of visiting literally every possible tile without triggering a loop, god only knows how the fuck that happened");
		return true;
	}

	let total = 0;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (y === forbidden[0] && x === forbidden[1]) continue;
			if (data[y][x] === '#') continue;
			let virtual_map = data.map(arr => arr.slice());
			virtual_map[y][x] = 'O';
			if (check_if_loop(virtual_map, [forbidden[0], forbidden[1]])) total++;
		}
	}
	console.log("total number uniquely obstacles", total);
})();
