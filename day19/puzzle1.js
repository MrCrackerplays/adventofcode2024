const fs = require("node:fs");
const FILENAME = "input";


(function main () {
	let data = fs.readFileSync(FILENAME, "utf8").slice(0, -1).split('\n\n');
	let patterns = data[0].split(', ');
	let designs = data[1].split('\n');

	/**
	 * @param {string} design
	 * @param {number} progress
	 */
	let is_possible = function(design, progress) {
		for (let pattern of patterns) {
			let possible = true;
			if (design.length < progress + pattern.length) possible = false;
			for (let i = 0; i < pattern.length && possible; i++) {
				if (design.charAt(progress + i) !== pattern.charAt(i)) possible = false;
			}
			if (possible && progress + pattern.length !== design.length) possible = is_possible(design, progress + pattern.length);
			if (possible) return true;
		}
		return false;
	}
	let total = 0;
	for (let design of designs) {
		if (is_possible(design, 0)) {
			total++;
		}
	}
	console.log("amount possible:", total);
})();
