const fs = require("node:fs");
const FILENAME = "input";


(function main () {
	const data = fs.readFileSync(FILENAME, "utf8").split('\n').map(l => l.split('').map(n => +n));
	const height = data.length;
	const width = data[0].length;

	/**
	 * @param {number[][]} arr
	 * @param {number[]} coords
	 */
	let inside = function(arr, coords) {
		for (let coord of arr)
			if (coord[0] === coords[0] && coord[1] === coords[1]) return true;
		return false;
	}

	/**
	 * @param {number[][]} trail_ends
	 * @param {number[][]} visited
	 * @param {number[]} current_coords
	 * @param {number} to_match
	 * @returns {number}
	 */
	let search = function(trail_ends, visited, current_coords, to_match) {
		let y = current_coords[0];
		let x = current_coords[1];
		if (x < 0 || x>= width || y < 0 || y >= height) return 0;
		let value = data[y][x];
		if (value !== to_match) return 0;
		if (inside(visited, current_coords)) return 0;
		if (value === 9) {
			trail_ends.push(current_coords);
			return 1;
		}
		return (search(trail_ends, [...visited, current_coords], [y + 1, x], to_match + 1)
			+ search(trail_ends, [...visited, current_coords], [y - 1, x], to_match + 1)
			+ search(trail_ends, [...visited, current_coords], [y, x + 1], to_match + 1)
			+ search(trail_ends, [...visited, current_coords], [y, x - 1], to_match + 1));
	}

	let total = 0;
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			if (data[i][j] !== 0) continue;
			total += search([], [], [i, j], 0);
		}
	}

	console.log("total:", total);
})();
