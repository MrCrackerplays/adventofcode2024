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

	/**
	 * @param {Map<number, Map<number, boolean>} visited
	 * @returns {number}
	 */
	let get_sides = function(visited) {
		let sides = 0;
		let directions_map = new Map();
		directions_map.set("up", new Map());
		directions_map.set("down", new Map());
		directions_map.set("left", new Map());
		directions_map.set("right", new Map());
		for (let i = 0; i < height; i++) directions_map.forEach(direction => {direction.set(i, new Map())});
		let check_directions = new Map();
		check_directions.set("up", [-1, 0]);
		check_directions.set("down", [1, 0]);
		check_directions.set("left", [0, -1]);
		check_directions.set("right", [0, 1]);
		let walk_directions = new Map();
		walk_directions.set("up", [0, 1]);
		walk_directions.set("down", [0, 1]);
		walk_directions.set("left", [1, 0]);
		walk_directions.set("right", [1, 0]);
		visited.forEach((line, y) => line.forEach((character, x) => {
			for (let [d, walkcoord] of walk_directions) {
				let checkcoord = check_directions.get(d);
				let map = directions_map.get(d);
				if (map.get(y).get(x) !== undefined) continue;
				// now y,x has not yet been checked for this direction
				if (visited.get(y + checkcoord[0])?.get(x + checkcoord[1]) !== undefined) continue;
				// now the neighbouring coord in the relevant direction was not visited, thus making y,x part of an unchecked edge for this direction
				// walk up/left along this edge until we can't go farther
				for (let i = 0; visited.get(y + walkcoord[0] * i)?.get(x + walkcoord[1] * i) === true; i--) {
					// took a step in the walking direction and the coord was a visited coord
					let temp_y = y + walkcoord[0] * i;
					let temp_x = x + walkcoord[1] * i;
					if (visited.get(temp_y + checkcoord[0])?.get(temp_x + checkcoord[1]) !== undefined) {
						// the step was not an edge in this direction
						map.get(temp_y).set(temp_x, false);
						break;
					}
					map.get(temp_y).set(temp_x, true);
				}
				// walk down/right along this edge until we can't go farther
				for (let i = 1; visited.get(y + walkcoord[0] * i)?.get(x + walkcoord[1] * i) === true; i++) {
					// took a step in the walking direction and the coord was a visited coord
					let temp_y = y + walkcoord[0] * i;
					let temp_x = x + walkcoord[1] * i;
					if (visited.get(temp_y + checkcoord[0])?.get(temp_x + checkcoord[1]) !== undefined) {
						// the step was not an edge in this direction
						map.get(temp_y).set(temp_x, false);
						break;
					}
					map.get(temp_y).set(temp_x, true);
				}
				// finished walking along the edge, thus defining a side
				sides++;
			}
		}));
		return sides;
	}

	let total = 0;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (data[y][x] === '.') continue;
			let visited = new Map();
			for (let i = 0; i < height; i++) visited.set(i, new Map());
			let area_perim = get_area_and_perim(x, y, data[y][x], visited);
			let sides = get_sides(visited);
			total += area_perim[0] * sides;
		}
	}
	console.log("total:", total);
})();
