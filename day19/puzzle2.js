const fs = require("node:fs");
const FILENAME = "input";


(function main () {
	let data = fs.readFileSync(FILENAME, "utf8").slice(0, -1).split('\n\n');
	let patterns = data[0].split(', ');
	let designs = data[1].split('\n');

	/** @type {Map<string, Map<number, number>>} */
	let my_cache = new Map();

	/**
	 * @param {string} design
	 * @param {number} progress
	 * @param {number} found
	 */
	let is_possible = function(design, progress, found) {
		if (!my_cache.has(design)) my_cache.set(design, new Map());
		if (my_cache.get(design).has(progress)) {
			return found + my_cache.get(design).get(progress);
		}
		let amount = 0;
		for (let pattern of patterns) {
			let possible = true;
			if (design.length < progress + pattern.length) possible = false;
			for (let i = 0; i < pattern.length && possible; i++) {
				if (design.charAt(progress + i) !== pattern.charAt(i)) possible = false;
			}

			if (possible && progress + pattern.length !== design.length) amount += is_possible(design, progress + pattern.length, found) - found;
			else if (possible) amount += 1;
		}
		my_cache.get(design).set(progress, amount);
		return found + amount;
	}

	let total = 0;
	for (let design of designs) {
		total += is_possible(design, 0, 0);
	}
	console.log("amount possible:", total);
})();
