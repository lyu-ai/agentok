# GroupChat and Functions

In this tutorial, we will learn how to use GroupChat and Functions to build an agent can search online news and write articles for you.

This tutorial is available as a FlowGen template [Search and Write](https://flowgen.app/gallery/udaciyj0xp325ye). You can chat with it directly, or fork it to modify the flow.

## Prerequisites

FlowGen. You can experiment with FlowGen [online](https://flowgen.app) or [run it on your local machine](https://docs.flowgen.app/docs/getting-started).

Our tutorial will use the online version of FlowGen.

## Steps

### Create a new Flow

Log in to FlowGen and click Build from Scratch to create a new Flow.

![Build from Scratch](./img/build-from-scratch.png)

### Orchestrate the Flow

Delete the existing sample nodes, then drag and drop the following nodes from the left panel to the canvas.

- `Assistant Agent`, name it `Searcher`
- `Assistant Agent`, name it `Writer`
- `UserProxy Agent`, name it `UserProxy`
- `GroupChat`, make sure the `Involve User` option is checked

![Alt text](./img/flow.png)

### Add Search function

Please follow these steps to add a search function:

1. Click the `Build Functions` button on Config node to open the Function Editor.

1. Click the Add Function button to add a new function.

1. Set the function name to `search_bing_news`, and set the description as `Search Bing for the question and return a list of found links.`, add a parameter `keyword`, with description as `The search keyword for Bing`.

1. Click the `Generate Code` button to generate the code for the function.

1. Check the generated code, and fix issues. AI can do the magic, but with some flaws. In this case, the generated code is not correct, we need to fix it.

The function UI should look like this:

![Alt text](./img/function-editor.png)

The generated code should look like this:

```python
import requests
from bs4 import BeautifulSoup

# Construct the search URL
search_url = f"""https://www.bing.com/news/search?q={keyword.replace(' ', '+')}&form=QBN&pq={keyword.replace(' ', '+')}&sc=8-0&sp=-1&qs=n&sk="""

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
    return links
else:
    return []
```

### Check the configurations

Click the `More Options` button on the UserProxy node and make sure the `Code Execution` is enabled.

![Alt text](./img/code-execution.png)

In the same option dialog, you can click the small robot head icon to fill in `TERMINATE` as the termination check flag of messages.

All the changes will be saved automatically.

### Everything is ready, Let's start with message

Now, we can start to chat with the Flow. Click the `Start Chat` button on the top right corner of the canvas, and you will see a chat window. Enter `search the lastest news about Elon Musk, and generate an article on it, a very detailed article.` in the input box and press Enter to start the chat.

The Searcher will search the news about Elon Musk and return a list of links. Then the Writer will extract the information from these links and then write a detailed article based on these retrieved news.

![Embed Chat](./img/embed-chat.png)

The area is not enough to show the whole chat, so we can click the `Open this chat in new window` to open the chat in a new tab.

![Standalone Chat](./img/chat.png)

Congratulations! You have successfully created a writing agent that can search and write articles for you.

### Conclusion

In this tutorial, we have learned how to use GroupChat and Functions to build a flow with code execution and collaboration between multiple agents. We also learned how to use the Function Editor to create a new function and use it in the Flow.
