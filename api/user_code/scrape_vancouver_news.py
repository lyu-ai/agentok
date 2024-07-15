# filename: scrape_vancouver_news.py

import requests
from bs4 import BeautifulSoup

def scrape_vancouver_news():
    URL = "https://vancouversun.com/category/news/"
    page = requests.get(URL)

    soup = BeautifulSoup(page.content, 'html.parser')

    # find news sections
    news_sections = soup.find_all('div', class_='article-card__content')

    # loop through each news section to extract details
    for news in news_sections:
        headline = news.find('h3', class_='article-card__headline').text
        date_posted = news.find('time', class_='updated')['datetime']
        link = news.find('a')['href']
    
        print("-------------------------------------------")
        print("Headline : ", headline)
        print("Date Posted : ", date_posted)
        print("Link : ", link)
        print()

scrape_vancouver_news()