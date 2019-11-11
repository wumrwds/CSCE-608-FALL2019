import random
import string

import pandas as pd


def randomword(length):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))


# get users generated in user_data_generation.py
users = pd.read_csv('data/users_data.csv')['username']

usernames = []
titles = []
descriptions = []
bodies = []

for i in range(0, 3000):
    # randomly select one user
    usernames.append(users[random.randint(0, users.size - 1)])
    titles.append(randomword(random.randint(15, 75)))
    descriptions.append(randomword(random.randint(75, 250)))
    bodies.append(randomword(random.randint(1000, 2000)))

df = pd.DataFrame(list(zip(usernames, titles, descriptions, bodies)),
                  columns=['username', 'title', 'description', 'body'])

df.to_csv(r'data/articles_data.csv')
