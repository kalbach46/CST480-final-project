### GET some stats for cards, attack + hp = 100 split
from random import randint
import random
random.seed(0)

TOTAL = 100
STATS = [(attack, TOTAL - attack) for attack in [randint(5,35) for _ in range(20)]]

INIT_CHARACTERS = {
    str(i) : {
        "attack" : attack,
        "hp" : hp
    } for i, (attack, hp) in enumerate(STATS, start=1)
}


print(INIT_CHARACTERS)