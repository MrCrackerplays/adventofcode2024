const fs = require("node:fs");
const FILENAME = "input";


(function main () {
	const data = fs.readFileSync(FILENAME, "utf8").slice(0, -1).split('\n\n');
	let warehouse = data[0].split('\n').map(line => line.split(''));
	let height = warehouse.length;
	let width = warehouse[0].length;
	let instructions = data[1].replaceAll('\n', '');
	let robot = [0, 0];
	robot[0] = warehouse.findIndex(line => {
		let find = line.findIndex(c => c === '@');
		if (find > -1) robot[1] = find;
		return find > -1;
	});

	for (let instruction of instructions) {
		let move = undefined;
		if (instruction === '^') move = [-1, 0];
		else if (instruction === '>') move = [0, 1];
		else if (instruction === 'v') move = [1, 0];
		else if (instruction === '<') move = [0, -1];
		if (move === undefined) continue;
		let position = [robot[0], robot[1]];
		while (warehouse[position[0]][position[1]] === '@' || warehouse[position[0]][position[1]] === 'O') {
			position[0] += move[0];
			position[1] += move[1];
		}
		if (warehouse[position[0]][position[1]] === '#') continue;
		if (position[0] === robot[0] + move[0] && position[1] === robot[1] + move[1]) {
			warehouse[position[0]][position[1]] = '@';
			warehouse[robot[0]][robot[1]] = '.'
		} else {
			warehouse[position[0]][position[1]] = 'O';
			warehouse[robot[0]][robot[1]] = '.';
			warehouse[robot[0] + move[0]][robot[1] + move[1]] = '@';
		}
		robot[0] += move[0];
		robot[1] += move[1];
	}
	let total = 0;
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			if (warehouse[i][j] === 'O') total += 100 * i + j;
		}
	}
	console.log("total:", total);
})();
