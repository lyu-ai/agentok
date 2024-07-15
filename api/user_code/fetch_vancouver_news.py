# filename: fetch_vancouver_news.py

import requests
import pprint

def fetch_news():
    url = "http://newsapi.org/v2/everything?q=Vancouver&sortBy=publishedAt&language=en&apiKey=YOUR_NEWSAPI_KEY"
    response = requests.get(url)
    data = response.json()
    pprint.pprint(data)

fetch_news()