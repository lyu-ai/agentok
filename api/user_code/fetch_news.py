# filename: fetch_news.py

import feedparser

def extract_headlines(rss_url):
    feed = feedparser.parse(rss_url)
    headlines = []

    for newsitem in feed['items']:
        headlines.append(newsitem['title'])

    return headlines

rss_url = "https://www.cbc.ca/cmlink/rss-canada-britishcolumbia"
headlines = extract_headlines(rss_url)
for headline in headlines:
    print(headline)