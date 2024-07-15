# filename: gdelt_event_search.py

from gdelt import gdelt as gd
import pandas as pd

def get_vancouver_events():
    # Version 2 queries
    gd2 = gd(version=2)

    # Get Events table, last 7 days
    results = gd2.Search(['2021 10 25', '2021 11 01'], table='events', coverage=True)

    # Filter for Vancouver events
    vancouver_events = results[results['ActionGeo_FullName'].str.contains('Vancouver', na=False)]
    
    print(vancouver_events[['GLOBALEVENTID', 'SQLDATE', 'ActionGeo_FullName','SOURCEURL']])

get_vancouver_events()