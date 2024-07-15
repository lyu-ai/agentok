# filename: get_news.py

import requests
import json

def get_news():
    API_KEY = 'YOUR_NEWS_API_KEY'  # replace with your News API key
    ENDPOINT = 'https://newsapi.org/v2/everything'
    PARAMS = {
        'q': 'Vancouver',
        'from': '2021-10-25',  # adjust the date to define 'this week'
        'sortBy': 'publishedAt',  # sort by the latest news
        'apiKey': API_KEY,
    }
    
    response = requests.get(url=ENDPOINT, params=PARAMS)
    data = response.json()

    if response.status_code == 200:
        # Fetch was successful, print the news articles
        for article in data['articles']:
            print('Title :', article['title'])
            print('Source :', article['source']['name'])
            print('Published At :', article['publishedAt'])
            print('URL :', article['url'])
            print()
    else:
        # Fetch was not successful, print the error message
        print('Could not fetch news due to:', data)

get_news()