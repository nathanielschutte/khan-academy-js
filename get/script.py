import requests
import json
from bs4 import BeautifulSoup

BASE_URL = 'https://khanacademy.org'

f = open('get/basepage.html', 'r')
content = f.read()

soup = BeautifulSoup(content, "html.parser")
project_divs = soup.find_all("div", class_="_eof4m4b")

# TEMP
# project_divs = [project_divs[4]]

BASE_QUERY_URL = 'https://www.khanacademy.org/api/internal/graphql/programQuery?lang=en&_=231005-1023-b72ed7a27e8b_1696644333505'

for project_div in project_divs:
    project_link = project_div.find("a", class_="_1666bk1u")
    project_title = project_link.find("span", class_="_w2mdcoh").text
    project_url = project_link["href"]
    project_id = project_url.split("/")[-1]
    print(f"{project_title}: {project_url} [{project_id}]")

    payload = json.load(open('get/query.json', 'r'))
    payload["variables"]["programId"] = project_id

    # if project_title != 'Water and Object Physics Sim':
    #     continue

    res = requests.post(f'https://www.khanacademy.org/api/internal/graphql/programQuery?lang=en&_=231005-1023-b72ed7a27e8b_1696644333505', json=payload)
    data = res.json()
    code: str = data['data']['programById']['revision']['code']

    if project_title == 'Water and Object Physics Sim':
        code = code.replace('\u03c9', 'uu')
    
    with open(f"{project_title.lower()}.js", 'w') as f:
        f.write(code)

    # https://www.khanacademy.org/api/internal/graphql/programQuery?lang=en&_=231005-1023-b72ed7a27e8b_1696644333505
