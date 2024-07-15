# filename: paris_news.py

from bs4 import BeautifulSoup
import requests
import re
from datetime import datetime, timedelta

# the past week
date_string = (datetime.now() - timedelta(days=7)).strftime('%m/%d/%Y')

# google news search url for "Paris"
url = f"https://www.google.com/search?q=paris+news&rlz=1C1GCEV_en&sxsrf=ALeKk00k5TEP7fJZHvpYO-1kAMLFW8FRFg%3A1649105617962&source=lnt&tbs=cdr%3A1%2Ccd_min%3A{date_string}%2Ccd_max%3A{datetime.now().strftime('%m/%d/%Y')}&tbm=nws"

# send a request to the website
r = requests.get(url)

# parse the content of the request
soup = BeautifulSoup(r.text, 'html.parser')

# get the news section of the google search
news = soup.find_all('div', attrs={'class': 'Y3v8qd'})

# print the titles of all news articles
for new in news:
    print(new.get_text())