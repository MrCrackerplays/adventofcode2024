const fs = require("node:fs");
const FILENAME = "input";


(function main () {
	let data = fs.readFileSync(FILENAME, "utf8").slice(0, -1).split('\n').map(l => l.split('-'));
	let inter_connected_length = 3;

	/** @type {Map<string, string[]>} */
	let nodes = new Map();

	/**
	 * @param {Map<string, string[]>} map
	 * @param {string} key
	 * @param {string} value
	 */
	let safe_add = function(map, key, value) {
		if (!map.has(key)) map.set(key, []);
		if (!map.get(key).includes(value))
			map.get(key).push(value);
	}

	for (let line of data) {
		safe_add(nodes, line[0], line[1]);
		safe_add(nodes, line[1], line[0]);
	}

	/** @type {string[][]} */
	let inter_connected = [];
	for (let [k, v] of nodes) {
		for (let i = 0; i < v.length; i++) {
			for (let j = i + 1; j < v.length; j++) {
				let first = v[i];
				let second = v[j];
				// k has both first and second, if first and second have eachother it means all 3 are interconnected
				if (!nodes.get(first).includes(second)) continue;
				let connected = [k, first, second].sort();
				if (inter_connected.find((v => {
					if (v.length !== connected.length) return false;
					for (let l = 0; l < v.length; l++) {
						if (v[l] !== connected[l]) return false;
					}
					return true;
				})) === undefined) {
					inter_connected.push(connected);
				}
			}
			
		}
	}

	let total = 0;
	for (let arr of inter_connected) {
		if (arr.length !== inter_connected_length) {
			continue;
		}
		let has_t = false;
		for (let s of arr) {
			if (s.charAt(0) === 't') {
				has_t = true;
				break;
			}
		}
		// has some starting t and is of the wanted length
		if (has_t) total+= 1;
	}

	console.log("amount possible:", total);
})();
