const fs = require("node:fs");
const FILENAME = "input";


(function main () {
	let data = fs.readFileSync(FILENAME, "utf8").slice(0, -1).split('\n\n');
	/** @type {[string, BigInt][]} */
	let xy = data[0].split('\n').map(l => l.split(': ').map((v, i) => {
		if (i === 1) return BigInt(v);
		return v;
	}));
	/** @type {[string, string, string, string, string][]} */
	let instructions = data[1].split('\n').map(l => l.split(' '));
	let value_map = new Map(xy);

	/** @type {Map<string, [string, string, string, string, string]>} */
	let uncalculated = new Map();

	/**
	 * @param {Map<string, [string, string, string, string, string][]>} map
	 * @param {string} key
	 * @param {[string, string, string, string, string]} value
	 */
	let safe_add = function(map, key, value) {
		if (!map.has(key)) map.set(key, []);
		map.get(key).push(value);
	}

	let queue = [...instructions]
	while (queue.length > 0) {
		let current = queue.shift();
		if (!value_map.has(current[0])) {
			safe_add(uncalculated, current[0], current);
			continue;
		}
		if (!value_map.has(current[2])) {
			safe_add(uncalculated, current[2], current);
			continue;
		}
		let value = 0;
		if (current[1] === "XOR") value = value_map.get(current[0]) ^ value_map.get(current[2]);
		else if (current[1] === "AND") value = value_map.get(current[0]) & value_map.get(current[2]);
		else if (current[1] === "OR") value = value_map.get(current[0]) | value_map.get(current[2]);
		value_map.set(current[4], value);
		if (uncalculated.has(current[4])) {
			for (let missed of uncalculated.get(current[4])) {
				queue.unshift(missed);
			}
			uncalculated.delete(current[4]);
		}
	}
	if (uncalculated.size > 0) {
		console.log("unlikely but there were values that never got calculated");
	}

	let keys = []
	for (let k of value_map.keys()) if (k.charAt(0) === 'z') keys.push(k);
	keys.sort().reverse();

	let total = BigInt(0);
	for (let k of keys) {
		total = total << BigInt(1);
		total = total | value_map.get(k);
	}
	// fuck js's 32 bit limit with bitwise operations
	console.log("output:", total);
})();
