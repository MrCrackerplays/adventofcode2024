import re

FILENAME = "input"
with open(FILENAME, "r") as f:
	data = f.read().rstrip().split("\n\n")

def simulate(increase_button: list[float], decrease_button: list[float], target: list[float], increase_token: float, decrease_token: float):
	target_x: float = target[0]
	target_y: float = target[1]
	increase_x: float = increase_button[0]
	increase_y: float = increase_button[1]
	decrease_x: float = decrease_button[0]
	decrease_y: float = decrease_button[1]
	# target_x = increase_x * a + decrease_x * b
	# target_y = increase_y * a + decrease_y * b

	# target_x = increase_x * a + decrease_x * b
	# increase_x * a + decrease_x * b = target_x
	# increase_x * a = target_x - decrease_x * b
	# a = (target_x - decrease_x * b) / increase_x

	# target_y = increase_y * a + decrease_y * b
	# target_y = increase_y * (target_x - decrease_x * b) / increase_x + decrease_y * b
	# target_y = (increase_y / increase_x) * (target_x - decrease_x * b) + decrease_y * b
	# target_y = target_x * increase_y / increase_x - decrease_x * increase_y / increase_x * b + decrease_y * b
	# target_y = target_x * increase_y / increase_x + (decrease_y - decrease_x * increase_y / increase_x) * b
	# target_x * increase_y / increase_x + (decrease_y - decrease_x * increase_y / increase_x) * b = target_y
	# (decrease_y - decrease_x * increase_y / increase_x) * b = (target_y - target_x * increase_y / increase_x)
	# b = (target_y - target_x * increase_y / increase_x) / (decrease_y - decrease_x * increase_y / increase_x)
	b = (target_y - target_x * increase_y / increase_x) / (decrease_y - decrease_x * increase_y / increase_x)
	a = (target_x - decrease_x * b) / increase_x
	a = round(a)
	b = round(b)
	if target_x == increase_x * a + decrease_x * b and target_y == increase_y * a + decrease_y * b:
		cost = increase_token * a + decrease_token * b
		# print(a, b, target, [increase_button[0] * a + decrease_button[0] * b, increase_button[1] * a + decrease_button[1] * b], cost)
		return cost
	return None
total = 0
for machine in data:
	a = [0., 0.]
	a_cost = 3
	b = [0., 0.]
	b_cost = 1
	for button in re.findall("[0-9][0-9]\, Y\+[0-9][0-9]", machine):
		values = [float(i) for i in button.split(", Y+")]
		if a[0] == 0. and a[1] == 0.:
			a = values
		else:
			b = values
	prize = [float(i) + 10000000000000 for i in re.search("[0-9]{1,9}\, Y\=[0-9]{1,9}", machine)[0].split(", Y=")]
	cost = simulate(a, b, prize, a_cost, b_cost)
	if (cost == None): continue
	total += cost
print("total tokens:")