import random
import string

import pandas as pd


def randomword(length):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))


# get users generated in user_data_generation.py
users = pd.read_csv('data/users_data.csv')['username']

# get articles generated in articles_data_generation.py
articles = pd.read_csv('data/articles_data.csv')['id']

usernames = []
article_ids = []
contents = []

for i in range(0, 2000):
    # select one user
    usernames.append(users[random.randint(0, users.size - 1)])
    # select one article
    article_ids.append(articles[random.randint(0, articles.size - 1)])

    contents.append(randomword(random.randint(15, 240)))

df = pd.DataFrame(list(zip(usernames, article_ids, contents)),
                  columns=['username', 'article_id', 'content'])

df.to_csv(r'data/comments_data.csv')
