import random
import string


def generate_username(first_name, last_name):
    names = f"{first_name} {last_name}"
    first_letter = names[0][0]
    three_letters_surname = names[-1][:3]
    number = "{:03d}".format(random.randrange(1, 999))
    username = first_letter + three_letters_surname + number
    return username


def generate_random_password():
    characters = list(string.ascii_letters + string.digits + "!@#$%^&*()")

    random.shuffle(characters)

    password = []
    for i in range(7):
        password.append(random.choice(characters))

    random.shuffle(password)

    return "".join(password)
