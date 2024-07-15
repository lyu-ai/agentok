# filename: top_headlines.py

import requests
from bs4 import BeautifulSoup

def get_top_headlines(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.content, 'html.parser')
        # Look for any h3 tag instead
        headlines = soup.find_all('h3')
        for headline in headlines[:5]:  # get the first 5 headlines
            print(headline.text.strip())  # strip unnecessary spaces
    except Exception as e:
        print(f"Error occurred: {e}")

get_top_headlines("https://www.bbc.com/news/world")