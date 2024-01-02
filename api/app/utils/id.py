import random
import string

def gen_id(length=13):
    # Create a string of all ascii letters and digits
    characters = string.ascii_letters + string.digits
    # Use random.choices to generate a list of random characters, then join them into a string
    random_string = ''.join(random.choices(characters, k=length))
    return random_string

# Example usage:
# random_string = gen_id()
# print(random_string)