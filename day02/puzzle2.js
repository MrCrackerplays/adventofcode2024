const fs = require("node:fs");
const readline = require("node:readline");
const FILENAME = "input";

function diff(a, b) {
	return Math.abs(a - b);
}

/** 
 * @param{number[]} levels
 */
function report_analysis(levels, danger_level = 0) {
	if (danger_level > 1) return false;
	let last = undefined;
	let last_direction = undefined;
	let is_safe = true;
	let encountered_problem = false;
	levels.forEach((v, i) => {
		if (!is_safe || encountered_problem) return;
		if (i === 0) {
			last = v;
			return;
		}
		// -1, 0, or 1 depending on if it's lower/the same/higher
		let cur_direction = last === v ? 0 : (v - last) / Math.abs(v - last);
		if (last_direction !== undefined && last_direction !== cur_direction) is_safe = false;
		if (cur_direction === 0 || diff(last, v) > 3) is_safe = false;
		if (!is_safe) {
			// check if valid without the current or last level
			is_safe = report_analysis(levels.filter((_, index) => index != i), danger_level + 1)
					|| report_analysis(levels.filter((_, index) => index != i - 1), danger_level + 1);
			// check for edgecase where removing the direction of the level before the last (should always be the first element?)
			// flips the directionality for the entire report
			if (i > 1 && !is_safe) is_safe = report_analysis(levels.filter((_, index) => index != i - 2), danger_level + 1);
			encountered_problem = true;
			return;
		}
		last_direction = cur_direction;
		last = v;
	});
	return is_safe;
}

(async function main () {
	const stream = fs.createReadStream(FILENAME);
	const rl = readline.createInterface({
		input: stream,
		crlfDelay: Infinity
	});

	let safe = 0;
	for await (const line of rl) {
		let levels = line.split(" ").map(v => +v);
		let is_safe = report_analysis(levels);
		if (is_safe) safe += 1;
	}
	console.log("total reports safe:", safe);
})();
