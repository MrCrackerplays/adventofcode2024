import re

FILENAME = "input"
with open(FILENAME, "r") as f:
	data = [int(x) for x in f.read().rstrip().split("\n")]

secret: int = 0
def mix(value: int):
	global secret
	secret = value ^ secret
def prune():
	global secret
	secret = secret % 16777216
def next_secret(n: int):
	mix(n * 64)
	prune()
	mix(secret // 32)
	prune()
	mix(secret * 2048)
	prune()

total = 0
for initial_secret in data:
	secret = initial_secret
	for i in range(2000):
		next_secret(secret)
	total += secret
print("total:", total)