const fs = require("node:fs");
const FILENAME = "input";


(function main () {
	let data = fs.readFileSync(FILENAME, "utf8").slice(0, -1).split(' ').map(l => +l);
	const BLINKS = 75;

	/** @type {Map<number, number[]>} */
	let my_cache = new Map();
	/**
	 * @param {number} n
	 * @returns {number[]}
	 */
	let apply_rule = function(n) {
		if (!my_cache.has(n)) {
			if (n === 0) {
				my_cache.set(n, [1]);
			} else if ((""+n).length % 2 === 0) {
				let temp = (""+n);
				let left = temp.slice(0, temp.length / 2);
				let right = temp.slice(temp.length / 2);
				my_cache.set(n, [+left, +right]);
			} else {
				my_cache.set(n, [n * 2024]);
			}
		}
		return my_cache.get(n);
	}
	/**
	 * @param {Map<number, number>} map
	 * @param {number} key
	 * @param {number} amount
	 */
	let safe_increase = function(map, key, amount) {
		if (!map.has(key)) map.set(key, amount);
		else map.set(key, map.get(key) + amount);
	}
	/** @type {Map<number, number>} */
	let value_tracker = new Map();
	data.forEach(v => safe_increase(value_tracker, v, 1));
	for (let i = 0; i < BLINKS; i++) {
		/** @type {Map<number, number>} */
		let new_value_tracker = new Map();
		value_tracker.forEach((v, k) => {
			let new_values = apply_rule(k);
			safe_increase(new_value_tracker, new_values[0], v);
			if (new_values.length === 2) safe_increase(new_value_tracker, new_values[1], v);
		});
		value_tracker = new_value_tracker;
	}
	let total = 0;
	value_tracker.forEach(v => total += v);
	console.log("total number of stones:", total);
})();
