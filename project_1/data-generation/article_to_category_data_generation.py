import random
import string

import pandas as pd


def randomword(length):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))


# get articles generated in articles_data_generation.py
articles = pd.read_csv('data/articles_data.csv')['id']

# get users generated in user_data_generation.py
categories = pd.read_csv('data/categories_data.csv')['id']

article_ids = []
category_ids = []

for i in range(0, articles.size):
    if i % 5 == 0:
        continue

    # select 0 to 3 categories
    randomCategories = random.choices(categories, k=random.randint(1, 4))

    for k in range(0, len(randomCategories)):
        # select current article
        article_ids.append(articles[i])

        category_ids.append(randomCategories[k])


df = pd.DataFrame(list(zip(article_ids, category_ids)),
                  columns=['article_id', 'category_id'])

df.to_csv(r'data/article_to_category_data.csv')
