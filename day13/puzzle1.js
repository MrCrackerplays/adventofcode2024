const fs = require("node:fs");
const FILENAME = "input";


(function main () {
	const data = fs.readFileSync(FILENAME, "utf8").slice(0, -1).split('\n\n');

	/**
	 * @param {[number, number]} increase_button
	 * @param {[number, number]} decrease_button
	 * @param {[number, number]} target
	 * @param {number} increase_token
	 * @param {number} decrease_token
	 * @returns {number}
	 */
	let simulate = function(increase_button, decrease_button, target, increase_token, decrease_token) {
		let cost = undefined;
		let position = [0, 0];
		let n = Math.ceil(target[0] / decrease_button[0]);
		let m = Math.ceil(target[1] / decrease_button[1]);
		let increase = 0;
		let decrease = Math.min(n, m);
		while (decrease >= 0) {
			position = [decrease_button[0] * decrease + increase_button[0] * increase, decrease_button[1] * decrease + increase_button[1] * increase];
			if (position[0] === target[0] && position[1] === target[1]) {
				let new_cost = increase * increase_token + decrease * decrease_token;
				if (cost === undefined || new_cost < cost) cost = new_cost;
			}
			if (position[0] > target[0] || position[1] > target[1]) {
				decrease--;
			} else {
				increase++;
			}
		}
		return cost;
	}
	let total = 0;
	for (let machine of data) {
		let a = [0, 0];
		let a_cost = 3;
		let b = [0, 0]
		let b_cost = 1
		for (button of machine.matchAll(/[0-9][0-9]\, Y\+[0-9][0-9]/g)) {
			/** @type(string) */
			let str = button[0];
			let values = str.split(", Y+").map(n => +n);
			if (a[0] === 0 && a[1] === 0)
				a = values;
			else
				b = values;
		}
		let prize = machine.match(/[0-9]{1,9}\, Y\=[0-9]{1,9}/g)[0].split(", Y=").map(n => +n);
		let cost = simulate(a, b, prize, a_cost, b_cost);
		if (cost === undefined) continue;
		total += cost;
	}
	console.log("total tokens:", total);
})();
