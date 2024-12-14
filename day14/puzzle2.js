const fs = require("node:fs");


(async function main () {
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
	let print = function() {
		for (let i = 0; i < height; i++) {
			let str = "";
			for (let j = 0; j < width; j++) {
				str += map.get(i).get(j) || '.';
			}
			console.log(str);
		}
	}
	function wait(time) {
		return new Promise(resolve => {
			setTimeout(resolve, time);
		});
	}
	let second = 0;
	for (let n = 0; n < 1000; n++) {
		for (let found = false; !found;) {
			second++;
			map = new Map();
			for (let i = 0; i < height; i++) map.set(i, new Map());
			for (let robot of data) {
				let position = robot[0];
				let velocity = robot[1];
				let new_position = [position[0] + velocity[0] * second, position[1] + velocity[1] * second];
				safe_add(new_position[0], new_position[1]);
			}
			let illegal = false;
			map.forEach(y => y.forEach(count => {
				if (illegal) return;
				if (count > 1) illegal = true;
			}));
			if (!illegal) found = true;
		}
		console.log(second);
		print();
		//just ctrl+c out when seeing the tree in console
		await wait(200);
	}
	let quadrant_scores = [0, 0, 0, 0];
	map.forEach((line, y) => line.forEach((count, x) => {
		let quadrant = 0;
		if (x === (width - 1) / 2 || y === (height - 1) / 2) return;
		if (x > (width - 1) / 2) quadrant += 1;
		if (y > (height - 1) / 2) quadrant += 2;
		quadrant_scores[quadrant] += count;
	}));
	
	let total = 1;
	quadrant_scores.forEach(q => total *= q);
	console.log("safety factor:", total);
})();
