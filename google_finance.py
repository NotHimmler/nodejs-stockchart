from datetime import date, timedelta, datetime
import urllib.request
import csv
import calendar
import json
import os
import sys
from pathlib import Path

#Get CSV file from google finance, historical
#Parse CSV to JSON
#Save JSON for particular stock ticker

#Query string to get historical data
#Start and end dates in format Jan 00, 0000 - MMM DD, YYYY
__query_string__ = "https://www.google.com/finance/historical?q={0}&startdate={1}&enddate={2}&output=csv"
__month_names__ = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Nov", "Dec"]

#Gets historical data 1 year from today
def get_historical_data(ticker_query):
    filename = './ticker-csv/{0}.csv'.format(ticker_query)
    my_file = Path(filename)

    if(not my_file.is_file()):
        try:
            urllib.request.urlretrieve(create_query_string(ticker_query), filename)
            json_from_csv(ticker_query)
            return True
        except urllib.error.HTTPError:
            print("There was an error")
            return False
    else:
        t_millis = os.path.getmtime(filename)
        file_datetime = datetime.fromtimestamp(t_millis)
        file_date = file_datetime.date()
        today = date.today()
        if (today - file_date) > timedelta(days=1):
            try:
                urllib.request.urlretrieve(create_query_string(ticker_query), filename)
                json_from_csv(ticker_query)
                return True
            except urllib.error.HTTPError:
                print("There was an error")
                return False
        else:
            return True

def format_date_for_api_request(date):
    day = date.day
    month = date.month
    year = date.year

    monthName = __month_names__[month-1]

    if day < 10:
        return "{0}+0{1}%2C+{2}".format(monthName, day, year)
    else:
        return "{0}+{1}%2C+{2}".format(monthName, day, year)

def create_query_string(ticker):
    today = date.today()
    year_ago = today - timedelta(days=367)
    return __query_string__.format(ticker, format_date_for_api_request(year_ago),format_date_for_api_request(today))

def timestamp_from_api_date(date_string):
    date_from_string = datetime.strptime(date_string, "%d-%b-%y")
    return calendar.timegm(date_from_string.timetuple())
    
def json_from_csv(ticker):
    with open("./ticker-csv/{0}.csv".format(ticker), newline="") as csvfile:
        reader = csv.reader(csvfile)
        
        result = []
        i = 0
        
        for row in reader:
            if i == 0:
                i = i + 1
            else:
                result = [[timestamp_from_api_date(row[0])*1000,float(row[len(row)-2])]] + result
        
        with open('./public/json/{0}.json'.format(ticker), 'w') as outfile:
            json.dump(result, outfile, separators=(',',':'))

print(json.dumps(get_historical_data(sys.argv[1])))