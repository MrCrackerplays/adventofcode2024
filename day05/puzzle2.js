const fs = require("node:fs");
const FILENAME = "input";


(function main () {
	const data = fs.readFileSync(FILENAME, "utf8").split('\n\n');
	const rules = data[0].split('\n').map(r => r.split('|').map(r => +r));
	const updates = data[1].split('\n').slice(0, -1).map(u => u.split(',').map(n => +n));

	const get_wrong_indexes = function(update) {
		for (let rule of rules) {
			let first = update.findIndex(v => v === rule[0]);
			let second = update.findIndex(v => v === rule[1]);
			if (first !== -1 && second !== -1) {
				if (second <= first) {
					return [first, second];
				}
			}
		}
		return undefined;
	}

	let counter = 0;
	for (let update of updates) {

		let indexes = get_wrong_indexes(update);
		if (indexes === undefined) continue;
		while (indexes !== undefined) {
			// swap order and then recheck for wrong indexes
			let temp = update[indexes[0]];
			update[indexes[0]] = update[indexes[1]];
			update[indexes[1]] = temp;
			indexes = get_wrong_indexes(update);
		}

		counter += update[Math.floor(update.length / 2)];
	}
	console.log("total found:", counter);
})();
