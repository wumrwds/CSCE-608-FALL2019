# Data Generation

All generated data is in the `data` directory.



`DDL_db_initialization.sql` is the DDL script for defining the database schemas.

These four scripts `article_data_generation.py`,`user_data_generation.py`,`comment_data_generation.py`, `article_to_category_data_generation.py` are used to generate the data of the four tables `User`, `Article`, `Comment`, `ArticleToCategory`. The tables `Role` and `Category` are small tables, so I just insert some tuples by hand.

We first generate all user data, then randomly select a user from the generated user data to generate the article data. Later, we can use the generated user data and article data to generate the comment data. After that, I insert the role and category data by hand. Finally, we can generate the data of the belongs-to relationship (article_to_category) by randomly select an article and k categories from the generated article and category data.

