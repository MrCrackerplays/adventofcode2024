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
	const directions = [
		[-1,0],
		[0,1],
		[1,0],
		[0,-1]
	];
	let direction = 0;
	/** @type(Map<number, Map<number, boolean>) */
	let visited = new Map();
	for (let i = 0; i < height; i++) {
		visited.set(i, new Map());
	}
	let iterations = 1;
	while(true) {
		visited.get(guard[0]).set(guard[1], true);
		let next = data[guard[0] + directions[direction][0]]
		if (next === undefined) break;
		next = next[guard[1] + directions[direction][1]];
		if (next === undefined) break;
		if (next === '#') {
			direction++;
			direction %= 4;
		} else {
			guard[0] += directions[direction][0];
			guard[1] += directions[direction][1];
		}
	}

	let total = 0;
	visited.forEach(v => v.forEach(_ => total++));
	console.log("total number uniquely visited", total);
})();
