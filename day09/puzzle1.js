const fs = require("node:fs");
const FILENAME = "input";


(function main () {
	const data = fs.readFileSync(FILENAME, "utf8").slice(0, -1);
	/** @param {number} i */
	let is_block = function(i) {
		return (i % 2 === 0);
	}

	/** @type {number[]} */
	let storage = [];
	for (let i = 0; i < data.length; i++) {
		let char = +data[i];
		for (let j = 0; j < char; j++) {
			if (is_block(i)) {
				storage.push(i / 2);
			} else {
				storage.push(-1);
			}
		}
	}
	let left = 0;
	let right = storage.length - 1;
	while (left < right) {
		if (storage[left] !== -1) left++;
		else if (storage[right] === -1) right--;
		else {
			storage[left] = storage[right];
			storage[right] = -1;
		}
	}

	let total = 0;
	for (let i = 0; i < storage.length && storage[i] !== -1; i++) {
		// position * ID
		total += i * storage[i];
	}
	console.log("total:", total);
})();
