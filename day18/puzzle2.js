const fs = require("node:fs");


(function main () {
	let FILENAME = "input";
	let width = 71;
	let height = 71;
	let bytes = 1024
	// FILENAME = "example";
	// width = 7;
	// height = 7;
	// bytes = 12;
	const data = fs.readFileSync(FILENAME, "utf8").slice(0, -1).split('\n').map(l => l.split(',').map(n => +n));

	let forbidden = data.slice(0, bytes);
	let position = [0, 0];
	let exit = [width - 1, height - 1];
	/** @type {string[][]} */
	let map = [];
	for (let i = 0; i < height; i++) {
		map.push([]);
		for (let j = 0; j < width; j++) {
			if (forbidden.find(coord => coord[0] === j && coord[1] === i) === undefined) map[i].push('.');
			else map[i].push('#');
		}
	}

	let distances = [];
	for (let i = 0; i < height; i++) {
		distances.push([]);
		for (let j = 0; j < width; j++) {
			distances[i].push(undefined);
		}
	}
	let fill_distances = function(x, y, dist) {
		if (x < 0 || y < 0 || x >= width || y >= height) return;
		if (map[y][x] === '#') return;
		if (distances[y][x] !== undefined && distances[y][x] <= dist) return;
		distances[y][x] = dist;
		fill_distances(x + 1, y, dist + 1);
		fill_distances(x - 1, y, dist + 1);
		fill_distances(x, y + 1, dist + 1);
		fill_distances(x, y - 1, dist + 1);
	}

	do {
		for (let i = 0; i < height; i++) {
			for (let j = 0; j < width; j++) {
				distances[i][j] = undefined;
			}
		}
		let latest_forbidden = [data[bytes - 1][0], data[bytes - 1][1]];
		map[latest_forbidden[1]][latest_forbidden[0]] = '#';
		fill_distances(position[0], position[1], 0);
		bytes++
	} while (distances[exit[1]][exit[0]] !== undefined);

	// for (let i = 0; i < height; i++) {
	// 	console.log(map[i].join(''));
	// }
	console.log("last placed:", data[bytes - 2][0] + "," + data[bytes - 2][1])
})();
