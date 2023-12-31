
import requests
from bs4 import BeautifulSoup

keyword="latest news about Elon Musk"
import requests
from bs4 import BeautifulSoup

# Construct the search URL
search_url = f"""https://www.bing.com/news/search?q={keyword.replace(' ', '+')}"""

print('search_url', search_url)
# Perform the HTTP request to Bing

response = requests.get(search_url)

# Check if the request was successful
if response.status_code == 200:
    # Parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')
    # Find all news articles
    articles = soup.find_all('div', {'class': 'news-card newsitem cardcommon'})
    # Extract the links from the news articles
    links = [article.find('a', href=True)['href'] for article in articles]
    print(links)
else:
    print("not found")
