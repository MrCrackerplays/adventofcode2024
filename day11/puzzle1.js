const fs = require("node:fs");
const FILENAME = "input";


(function main () {
	let data = fs.readFileSync(FILENAME, "utf8").slice(0, -1).split(' ').map(l => +l);
	const BLINKS = 25;

	/**
	 * @param {number} n
	 * @returns {number[]}
	 */
	let apply_rule = function(n) {
		if (n === 0) {
			return [1];
		} else if ((""+n).length % 2 === 0) {
			let temp = (""+n);
			let left = temp.slice(0, temp.length / 2);
			let right = temp.slice(temp.length / 2);
			return [+left, +right];
		} else {
			return [n * 2024];
		}
	}
	for (let i = 0; i < BLINKS; i++) {
		let new_line = [];
		data.forEach(val => {
			apply_rule(val).forEach(new_val => new_line.push(new_val));
		});
		data = new_line;
	}
	let total = data.length;
	console.log("total number of stones:", total);
})();
