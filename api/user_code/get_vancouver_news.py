# filename: get_vancouver_news.py

import feedparser

def print_vancouver_news_headlines():
    url="https://www.cbc.ca/cmlink/rss-canada-britishcolumbia"
    feed = feedparser.parse(url)

    for post in feed.entries:
        print(post.title)

print_vancouver_news_headlines()