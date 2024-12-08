const fs = require("node:fs");
const FILENAME = "input";


(function main () {
	//[line][result] || [line][parts][number]
	const data = fs.readFileSync(FILENAME, "utf8").split('\n').slice(0, -1).map(line => line.split(''));
	const height = data.length;
	const width = data[0].length;
	const allchars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	/** @type {Map<string, number[][]>} */
	let positions = new Map();
	for (let char of allchars) {
		positions.set(char, []);
	}
	let is_frequency = function(char) {
		return allchars.includes(char);
	}
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (!is_frequency(data[y][x])) continue;
			positions.get(data[y][x]).push([y, x]);
		}
	}
	/** 
	 * @param {Map<number,Map<number, boolean>>} map
	 * @param {number} key_1
	 * @param {number} key_2
	 */
	let safe_add = function(map, key_1, key_2) {
		if (!map.has(key_1)) map.set(key_1, new Map());
		map.get(key_1).set(key_2, true);
	}
	/** @type {Map<number,Map<number, boolean>>} */
	let antinodes = new Map();
	positions.forEach(v => v.forEach((pos, i) => v.slice(i + 1).forEach(subsequent_pos => {
		let top_left = [];
		let bottom_right = [];
		if (pos[0] < subsequent_pos[0]) {
			top_left = pos;
			bottom_right = subsequent_pos;
		} else if (pos[0] === subsequent_pos[0] && pos[1] < subsequent_pos[1]) {
			top_left = pos;
			bottom_right = subsequent_pos;
		} else {
			top_left = subsequent_pos;
			bottom_right = pos;
		}
		let dy = top_left[0] - bottom_right[0];
		let dx = top_left[1] - bottom_right[1];
		if (top_left[0] + dy >= 0 && top_left[0] + dy < height && top_left[1] + dx >= 0 && top_left[1] + dx < width)
			safe_add(antinodes, top_left[0] + dy, top_left[1] + dx);
		if (bottom_right[0] - dy >= 0 && bottom_right[0] - dy < height && bottom_right[1] - dx >= 0 && bottom_right[1] - dx < width)
			safe_add(antinodes,bottom_right[0] - dy, bottom_right[1] - dx);
	})));

	let total = 0;
	//should always just add 1
	antinodes.forEach(x => total += x.size);
	console.log("total:", total);
})();
