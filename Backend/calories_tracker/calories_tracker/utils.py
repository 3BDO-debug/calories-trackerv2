import random
import string


def generate_username(first_name, last_name):
    names = f"{first_name} {last_name}"
    first_letter = names[0][0]
    three_letters_surname = names[-1][:3]
    number = "{:03d}".format(random.randrange(1, 999))
    return first_letter + three_letters_surname + number


def generate_random_password():
    characters = list(string.ascii_letters + string.digits + "!@#$%^&*()")

    random.shuffle(characters)

    password = [random.choice(characters) for _ in range(7)]
    random.shuffle(password)

    return "".join(password)
