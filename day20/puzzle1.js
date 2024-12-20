const fs = require("node:fs");
const FILENAME = "input";


(function main () {
	let data = fs.readFileSync(FILENAME, "utf8").slice(0, -1).split('\n').map(l => l.split(''));
	let height = data.length;
	let width = data[0].length;
	let s = [0, 0];
	let e = [0, 0];
	data.forEach((line, y) => line.forEach((char, x) => {
		if (char === 'S') s = [y, x];
		if (char === 'E') e = [y, x];
	}));
	/** @type {number[][]} */
	let distances = [];
	for (let i = 0; i < height; i++) {
		distances.push([]);
		for (let j = 0; j < width; j++) {
			distances[i].push(Infinity);
		}
	}
	let fill_distances = function(x, y, dist) {
		let queue = [[y, x, dist]];
		let is_valid = function(x, y) {
			if (x < 1 || y < 1 || x >= width - 1 || y >= height - 1) return false;
			if (data[y][x] === '#') return false;
			return true;
		}
		while(queue.length > 0) {
			let [y, x, dist] = queue.pop();
			if (dist >= distances[y][x]) continue;
			distances[y][x] = dist;
			if (is_valid(x+1,y))
				queue.push([y, x + 1, dist + 1]);
			if (is_valid(x-1,y))
				queue.push([y, x - 1, dist + 1]);
			if (is_valid(x,y+1))
				queue.push([y + 1, x, dist + 1]);
			if (is_valid(x,y-1))
				queue.push([y - 1, x, dist + 1]);
		}
	}
	fill_distances(s[1], s[0], 0);

	// [[[y,x], [y,x],...],...]
	/** @type {[number, number][][]} */
	let paths = [];
	let find_paths = function(x, y, dist, current_path) {
		let queue = [[y, x, dist, current_path]];
		let is_valid = function(x, y) {
			if (x < 1 || y < 1 || x >= width - 1 || y >= height - 1) return false;
			if (data[y][x] === '#') return false;
			return true;
		}
		while (queue.length > 0) {
			let [y, x, dist, current_path] = queue.pop();
			if (x === s[1] && y === s[0]) {
				paths.push([...current_path, [y,x]]);
				continue;
			}
			if (is_valid(x+1,y) && dist - 1 === distances[y][x+1])
				queue.push([y, x + 1, dist - 1, [...current_path, [y,x]]]);
			if (is_valid(x-1,y) && dist - 1 === distances[y][x-1])
				queue.push([y, x - 1, dist - 1, [...current_path, [y,x]]]);
			if (is_valid(x,y+1) && dist - 1 === distances[y+1][x])
				queue.push([y + 1, x, dist - 1, [...current_path, [y,x]]]);
			if (is_valid(x,y-1) && dist - 1 === distances[y-1][x])
				queue.push([y - 1, x, dist - 1, [...current_path, [y,x]]]);
		}
	}
	find_paths(e[1], e[0], distances[e[0]][e[1]], []);
	console.log("number of possible paths", paths.length);

	/** 
	 * @param {Map<string,Map<string, number>>} map
	 * @param {string} key_1
	 * @param {string} key_2
	 * @param {number} value
	 */
	let safe_set = function(map, key_1, key_2, value) {
		if (!map.has(key_1)) map.set(key_1, new Map());
		map.get(key_1).set(key_2, value);
	}

	let is_first = function(a, b) {
		if (a[0] < b[0]) return true;
		if (a[0] > b[0]) return false;
		if (a[1] < b[1]) return true;
		return false;
	}
	// Map<'y,x', Map<'y,x', saved>>
	/** @type {Map<string, Map<string, number>>} */
	let saves = new Map();
	for (let path of paths) {
		console.log("path length:", path.length);
		for (let i = 0; i < path.length; i++) {
			for (let j = i + 1; j < path.length; j++) {
				let a = path[i];
				let b = path[j];
				if (!is_first(a, b)) {
					a = path[j];
					b = path[i];
				}
				let key_a = a[0] + ',' + a[1];
				let key_b = b[0] + ',' + b[1];
				if (saves.has(key_a) && saves.get(key_a).has(key_b)) continue;
				if ((a[0] === b[0] && Math.abs(a[1] - b[1]) === 2) || (a[1] === b[1] && Math.abs(a[0] - b[0]) === 2)) {
					let saved = Math.abs(distances[a[0]][a[1]] - distances[b[0]][b[1]]) - 2;
					if (saved > 0) safe_set(saves, key_a, key_b, saved);
				}
			}
		}
	}
	let total = 0;
	saves.forEach(a => a.forEach(v => {
		if (v >= 100) total++;
	}))
	console.log("amount possible:", total);
})();
