#Author: Ritchie Yapp

import os

def replace_strings_in_files(directory_path, old_string, new_string):
    for file_name in os.listdir(directory_path):
        file_path = os.path.join(directory_path, file_name)
        if os.path.isfile(file_path):  # check if the path is a file
            replace_strings_in_file(file_path, old_string, new_string)
            print(file_name, " successfully replaced")

def replace_strings_in_file(file_path, old_string, new_string):
    with open(file_path, 'r') as file:
        content = file.read()

    updated_content = content.replace(old_string, new_string)

    with open(file_path, 'w') as file:
        file.write(updated_content)

# Usage
directory_path = './controller/public'  # specify the directory where the files are located
old_string = """<input type="text" class="form-control" placeholder="Search for products">"""
new_string = """<input type="text" class="form-control" id="searchBar" placeholder="Search for products">"""  # specify the new string

replace_strings_in_files(directory_path, old_string, new_string)
