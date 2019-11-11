import random
import string

import pandas as pd


def randomword(length):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))


# get name dictionary
name_dictionary = pd.read_csv('dictionary/name_dictionary.csv')['name']

# email suffix dictionary
email_suffix = ["aol.com", "att.net", "comcast.net", "facebook.com", "gmail.com", "gmx.com", "googlemail.com",
                "google.com", "hotmail.com", "hotmail.co.uk", "mac.com", "me.com", "mail.com", "msn.com",
                "live.com", "sbcglobal.net", "verizon.net", "yahoo.com", "yahoo.co.uk"]

usernames = []
nicknames = []
emails = []
descriptions = []
avatars = []
role_ids = []

for i in range(0, 200):
    usernames.append(randomword(random.randint(12, 24)))
    # randomly select a name from the name dictionary
    nicknames.append(name_dictionary[random.randint(0, name_dictionary.size - 1)])
    # randomly select a email suffix and generate a email
    emails.append(randomword(random.randint(8, 14)) + "@" + email_suffix[random.randint(0, len(email_suffix) - 1)])
    descriptions.append(randomword(random.randint(15, 300)))
    avatars.append(randomword(80))
    role_ids.append(random.randint(0, 1))

df = pd.DataFrame(list(zip(usernames, nicknames, emails, descriptions, avatars, role_ids)),
                  columns=['username', 'nickname', 'email', 'description', 'avatar', 'role_id'])

df.to_csv(r'data/users_data.csv')
