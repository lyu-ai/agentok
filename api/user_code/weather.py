# filename: weather.py

import json
import requests
from urllib.request import urlopen

API_KEY = 'your_api_key' # Replace 'your_api_key' with your actual OpenWeatherMap API key.
URL = "http://api.openweathermap.org/data/2.5/weather?q={}&appid={}"

def get_location():
    url = 'http://ip-api.com/json/'
    res = urlopen(url)
    data = json.load(res)
    city = data['city']
    return city

def get_weather_info(city):
    final_url = URL.format(city, API_KEY)
    response = requests.get(final_url)
    weather_data = response.json()
    if response.status_code != 200:
        print("Error fetching weather data: ", weather_data)
    return weather_data

if __name__ == "__main__":
    city = get_location()
    info = get_weather_info(city)
    try:
        weather = info['weather'][0]['description']
        temp = info['main']['temp']
        temp = temp - 273.15 # Convert Kelvin to Celsius
        print(f'Weather in {city}:\n - {weather.capitalize()}\n - Temperature: {temp:.2f}°C')
    except KeyError:
        print("Could not get weather data.")