const fs = require("node:fs");
const FILENAME = "input";


(function main () {
	//[line][result] || [line][parts][number]
	const data = fs.readFileSync(FILENAME, "utf8").split('\n').slice(0, -1).map(l => l.split(": ").map((v, i) => {
		if (i === 0) return +v;
		return v.split(' ').map(n => +n);
	}));
	/** 
	 * @param {number} result
	 * @param {number} current_value
	 * @param {number[]} remaining_values
	 * @returns {boolean}
	 */
	let has_truth = function(result, current_value, remaining_values) {
		if (remaining_values.length === 0) return current_value === result;
		let next_remaining = remaining_values.filter((_, i) => i !== 0);
		return has_truth(result, current_value + remaining_values[0], next_remaining)
			|| has_truth(result, current_value * remaining_values[0], next_remaining)
			|| has_truth(result, +(current_value +""+ remaining_values[0]), next_remaining);
	}
	let total = 0;
	for (let line of data) {
		/** @type(number) */
		const result = line[0];
		/** @type(number[]) */
		const values = line[1];
		if (has_truth(result, values[0], values.filter((_, i) => i !== 0))) {
			total += result;
		}
	}

	console.log("total number uniquely obstacles", total);
})();
