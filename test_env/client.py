#Author: Ritchie Yapp 
#https://github.com/speckly

import requests

# req = requests.get('https://api.github.com/user', auth=('user', 'pass'))
#req has attribute status_code, text, headers[content-type]
#req has method .json()

req = requests.post('https://httpbin.org/post', data={'key': 'value'}, params={"pp": "balls"})
print(req.json())
print(req.status_code)