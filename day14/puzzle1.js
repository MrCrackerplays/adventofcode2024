const fs = require("node:fs");


(function main () {
	let FILENAME = "input";
	let width = 101;
	let height = 103
	// FILENAME = "example";
	// width = 11;
	// height = 7;
	let data = fs.readFileSync(FILENAME, "utf8").slice(0, -1).split('\n').map(l => l.split(' ').map(coord => coord.slice(2).split(',').map(n => +n)));

	/** @type {Map<number, Map<number, number>>} */
	let map = new Map();
	for (let i = 0; i < height; i++) map.set(i, new Map());
	let safe_add = function(x, y) {
		while (x < 0) x += width;
		while (y < 0) y += height;
		x %= width;
		y %= height;
		if (!map.get(y).has(x)) map.get(y).set(x, 0);
		map.get(y).set(x, map.get(y).get(x) + 1);
	}
	let safe_remove = function(x, y) {
		if (!map.get(y).has(x)) return;
		map.get(y).set(x, map.get(y).get(x) - 1);
		if (map.get(y).get(x) === 0) map.get(y).delete(x);
	}
	for (let robot of data) {
		let position = robot[0];
		let velocity = robot[1];
		let second = 100;
		let new_position = [position[0] + velocity[0] * second, position[1] + velocity[1] * second];
		safe_add(new_position[0], new_position[1]);
	}
	let quadrant_scores = [0, 0, 0, 0];
	map.forEach((line, y) => line.forEach((count, x) => {
		let quadrant = 0;
		if (x === (width - 1) / 2 || y === (height - 1) / 2) return;
		if (x > (width - 1) / 2) quadrant += 1;
		if (y > (height - 1) / 2) quadrant += 2;
		quadrant_scores[quadrant] += count;
	}));
	// for (let i = 0; i < height; i++) {
	// 	let str = "";
	// 	for (let j = 0; j < width; j++) {
	// 		if (j === (width - 1) / 2 || i === (height - 1) / 2) str += ' ';
	// 		else str += map.get(i).get(j) || '.';
	// 	}
	// 	console.log(str);
	// }
	let total = 1;
	quadrant_scores.forEach(q => total *= q);
	console.log("safety factor:", total);
})();
