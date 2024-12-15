const fs = require("node:fs");
const FILENAME = "input";


(function main () {
	const data = fs.readFileSync(FILENAME, "utf8").slice(0, -1).split('\n\n');
	let warehouse = data[0].split('\n').map(line => line.split('').map(c => {
		if (c === '#') return '##';
		if (c === 'O') return '[]';
		if (c === '.') return '..';
		if (c === '@') return '@.';
	}).join('').split(''));
	let height = warehouse.length;
	let width = warehouse[0].length;
	let instructions = data[1].replaceAll('\n', '');
	let robot = [0, 0];
	robot[0] = warehouse.findIndex((line, i) => {
		let find = line.findIndex(c => c === '@');
		if (find > -1) robot[1] = find;
		return find > -1;
	});
	/** 
	 * @param {Map<number,Map<number, any>>} map
	 * @param {number} key_1
	 * @param {number} key_2
	 * @param {any} value
	 */
	let safe_set = function(map, key_1, key_2, value) {
		if (!map.has(key_1)) map.set(key_1, new Map());
		map.get(key_1).set(key_2, value);
	}

	/**
	 * @param {[number, number]} move
	 * @param {Map<number,Map<number, string>>} next
	 * @param {[number, number]} position
	 * @param {Map<number,Map<number, boolean>>} processed
	 * @returns {boolean}
	 */
	let try_move = function(move, next, position, processed) {
		if (processed.get(position[0])?.get(position[1]) !== undefined) return true;
		safe_set(processed, position[0], position[1], true);
		let success = false;
		if (warehouse[position[0]][position[1]] === '.') return true;
		else if (warehouse[position[0]][position[1]] === '#') return false;
		else if (warehouse[position[0]][position[1]] === '[') {
			success = try_move(move, next, [position[0] + move[0], position[1] + move[1] + 1], processed) && try_move(move, next, [position[0] + move[0], position[1] + move[1]], processed);
		}
		else if (warehouse[position[0]][position[1]] === ']') {
			success = try_move(move, next, [position[0] + move[0], position[1] + move[1] - 1], processed) && try_move(move, next, [position[0] + move[0], position[1] + move[1]], processed);
		}
		if (!success) return false;
		safe_set(next, position[0] + move[0], position[1] + move[1], warehouse[position[0]][position[1]]);
		if (warehouse[position[0]][position[1]] === '[')
			safe_set(next, position[0] + move[0], position[1] + move[1] + 1, ']');
		else if (warehouse[position[0]][position[1]] === ']')
			safe_set(next, position[0] + move[0], position[1] + move[1] - 1, '[');
		return true;
	}


	for (let instruction of instructions) {
		let move = undefined;
		if (instruction === '^') move = [-1, 0];
		else if (instruction === '>') move = [0, 1];
		else if (instruction === 'v') move = [1, 0];
		else if (instruction === '<') move = [0, -1];
		if (move === undefined) continue;
		let position = [robot[0] + move[0], robot[1] + move[1]];
		let next = new Map();
		if (try_move(move, next, position, new Map())) {
			for (let i = 1; i < height - 1; i++) {
				for (let j = 1; j < width - 1; j++) {
					let t_i = i;
					if (move[0] > 0) {
						t_i = height - 1 - i;
					}
					let t_j = j;
					if (move[1] > 0) {
						t_j = width - 1 - j;
					}
					if (next.has(t_i) && next.get(t_i).has(t_j)) {
						warehouse[t_i][t_j] = warehouse[t_i - move[0]][t_j - move[1]];
						warehouse[t_i - move[0]][t_j - move[1]] = '.';
					}
				}
			}
			warehouse[position[0]][position[1]] = '@';
			warehouse[robot[0]][robot[1]] = '.';
			robot = position;
		}
	}
	let total = 0;
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			if (warehouse[i][j] === '[') total += 100 * i + j;
		}
	}
	console.log("total:", total);
})();
