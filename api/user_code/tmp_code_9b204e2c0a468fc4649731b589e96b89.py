import requests
import pandas as pd

def get_stock_data(symbol, api_key='YOUR_API_KEY'):
    base_url = 'https://www.alphavantage.co/query?'
    function = 'TIME_SERIES_DAILY_ADJUSTED'

    response = requests.get(f'{base_url}function={function}&symbol={symbol}&apikey={api_key}')
    
    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()
        print("Received data: ", data)
      
        # Check if 'Time Series (Daily)' is in data
        if 'Time Series (Daily)' in data:
            data = data['Time Series (Daily)']
            df = pd.DataFrame.from_dict(data).T
            df = df.sort_index()
            return df
        else:
            return "The key 'Time Series (Daily)' was not found in the data."
    else:
        return "Request failed."

# Test with Apple stock
print(get_stock_data('AAPL'))