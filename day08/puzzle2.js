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
		safe_add(antinodes, pos[0], pos[1]);
		let pointer = [pos[0], pos[1]];
		let dy = pos[0] - subsequent_pos[0];
		let dx = pos[1] - subsequent_pos[1];
		pointer[0] += dy;
		pointer[1] += dx;
		while (pointer[0] >= 0 && pointer[0] < height && pointer[1] >= 0 && pointer[1] < width) {
			safe_add(antinodes, pointer[0], pointer[1]);
			pointer[0] += dy;
			pointer[1] += dx;
		}
		pointer[0] = pos[0] - dy;
		pointer[1] = pos[1] - dx;
		while (pointer[0] >= 0 && pointer[0] < height && pointer[1] >= 0 && pointer[1] < width) {
			safe_add(antinodes,pointer[0], pointer[1]);
			pointer[0] -= dy;
			pointer[1] -= dx;
		}
	})));

	let total = 0;
	//should always just add 1
	antinodes.forEach(x => total += x.size);
	console.log("total:", total);
})();
