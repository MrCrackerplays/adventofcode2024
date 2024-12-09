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
	/**
	 * @param {number[]} storage
	 * @param {number} length 
	 * @returns {number} index
	 */
	let find_space = function(storage, length, limit) {
		let i = 0;
		while (i < limit) {
			for (let j = 0; j < length; j++) {
				if (storage[i + j] !== -1) {
					i += j + 1;
					break;
				}
				if (j === length - 1) return i;
			}
		}
		return -1;
	}
	let file_id = -1;
	// get right-most id, done like this in case storage ends in some free space
	{
		let i = storage.length - 1;
		while (storage[i] === -1) i--;
		file_id = storage[i];
	}
	for (; file_id > 0; file_id--) {
		let right = storage.lastIndexOf(file_id);
		if (right < 0) continue;
		let left = right;
		while (left > 0 && storage[left - 1] === file_id) left--;
		const length = right - left + 1;
		let space = find_space(storage, length, left);
		if (space === -1 || left < space) continue;
		for (let i = 0; i < length; i++) {
			storage[space + i] = file_id;
			storage[left + i] = -1;
		}
	}

	let total = 0;
	for (let i = 0; i < storage.length; i++) {
		// position * ID
		if (storage[i] !== -1) total += i * storage[i];
	}
	console.log("total:", total);
})();
