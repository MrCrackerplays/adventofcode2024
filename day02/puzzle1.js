const fs = require("node:fs");
const readline = require("node:readline");
const FILENAME = "input";

function diff(a, b) {
	return Math.abs(a - b);
}

(async function main (){
	const stream = fs.createReadStream(FILENAME);
	const rl = readline.createInterface({
		input: stream,
		crlfDelay: Infinity
	});

	let safe = 0;
	for await (const line of rl) {
		let last = undefined;
		let last_direction = undefined;
		let is_safe = true;
		line.split(" ").map(v => +v).forEach((v, i) => {
			if (!is_safe) return;
			if (i < 1) {
				last = v;
				return;
			}
			// -1, 0, or 1 depending on if it's lower/the same/higher
			let cur_direction = last === v ? 0 : (v - last) / Math.abs(v - last);
			if (last_direction !== undefined && last_direction !== cur_direction) is_safe = false;
			if (cur_direction === 0 || diff(last, v) > 3) is_safe = false;
			last_direction = cur_direction;
			last = v;
		});
		if (is_safe) safe += 1;
	}
	console.log("total reports safe:", safe);
})();
