const fs = require("node:fs");
const FILENAME = "input";


(function main () {
	let data = fs.readFileSync(FILENAME, "utf8").slice(0, -1).split('\n').map(l => l.split(''))
	const height = data.length;
	const width = data[0].length;

	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {string} matching
	 * @param {Map<number,Map<number, boolean>>} visited
	 * @returns {[number, number]}
	 */
	let get_area_and_perim = function(x, y, matching, visited) {
		if (x < 0 || x >= width || y < 0 || y >= height) return [0, 1];
		if (visited.get(y).get(x) === true) return [0, 0];
		if (data[y][x] !== matching) return [0, 1];
		visited.get(y).set(x, true);
		data[y][x] = '.';
		let value = [1, 0];
		let temp = get_area_and_perim(x + 1, y, matching, visited);
		value[0] += temp[0];
		value[1] += temp[1];
		temp = get_area_and_perim(x - 1, y, matching, visited);
		value[0] += temp[0];
		value[1] += temp[1];
		temp = get_area_and_perim(x, y + 1, matching, visited);
		value[0] += temp[0];
		value[1] += temp[1];
		temp = get_area_and_perim(x, y - 1, matching, visited);
		value[0] += temp[0];
		value[1] += temp[1];
		return value;
}

	let total = 0;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (data[y][x] === '.') continue;
			let visited = new Map();
			for (let i = 0; i < height; i++) visited.set(i, new Map());
			let area_perim = get_area_and_perim(x, y, data[y][x], visited);
			total += area_perim[0] * area_perim[1];
		}
	}
	console.log("total:", total);
})();
