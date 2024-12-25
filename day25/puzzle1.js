const fs = require("node:fs");
const FILENAME = "input";


(function main () {
	let data = fs.readFileSync(FILENAME, "utf8").slice(0, -1).split('\n\n').map(schematic => schematic.split('\n').map(c => c.split('')));
	let height = data[0].length;
	let width = data[0][0].length;

	/** @type {number[]} */
	let numbified = [];

	// indexes of numbified
	/** @type {number[]} */
	let keys = [];
	/** @type {number[]} */
	let locks = [];

	/**
	 * @param {string[][]} schematic
	 */
	let is_key = function(schematic) {
		if (schematic[0][0] === '#') return false;
		return true;
	}

	for (let schem of data) {
		let key = is_key(schem);
		let layout = [];
		for (let x = 0; x < width; x++) {
			let tumble = 0;
			for (let y = 1; y < height - 1; y++) {
				let check = key ? height - 1 - y : y;
				if (schem[check][x] === '#') {
					tumble++;
				} else {
					break;
				}
			}
			layout.push(tumble);
		}
		let pos = numbified.push(layout) - 1;
		if (key) {
			keys.push(pos);
		} else {
			locks.push(pos);
		}
	}

	let total = 0;

	for (let l of locks) {
		let lock = numbified[l];
		for (let k of keys) {
			let key = numbified[k];
			let compatible = true;
			for (let i = 0; compatible && i < width; i++) {
				if (lock[i] + key[i] > height - 2) {
					//overlap
					compatible = false;
				}
			}
			if (compatible) {
				total++;
			}
		}
	}

	console.log("output:", total);
})();
