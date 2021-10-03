import requests
import pandas as pd

# parameters = "ALLSKY_SFC_LW_DWN"
# location = {"latitude": "80", "longitude": "13"}
# date = {"start_date": "20210202", "end_date": "20210204"}
# request = "https://power.larc.nasa.gov/api/temporal/daily/point?parameters=" + parameters + "&community=RE&longitude=" + location["longitude"] + "&latitude=" + location["latitude"] + "&start=" + date["start_date"] + "&end=" + date["end_date"] + "&format=JSON"

# response = requests.get(request)

# print(response.json())

def daily_api(location, end_date):
    parameters = "ALLSKY_SFC_LW_DWN"
    start_date = "2000" + str(end_date["month"]).zfill(2) + str(end_date["date"]).zfill(2)
    end_date = str(end_date["year"]) + str(end_date["month"]).zfill(2) + str(end_date["date"]).zfill(2)
    print(start_date, end_date)
    date = {"start_date": start_date, "end_date": end_date}
    request = "https://power.larc.nasa.gov/api/temporal/daily/point?parameters=" + parameters + "&community=RE&longitude=" + location["longitude"] + "&latitude=" + location["latitude"] + "&start=" + date["start_date"] + "&end=" + date["end_date"] + "&format=JSON"

    response = requests.get(request).json()
    print(response["properties"]["parameter"]["ALLSKY_SFC_LW_DWN"])
    # c=0
    # for i in response["properties"]["parameter"]["ALLSKY_SFC_LW_DWN"]:
    #     if(response["properties"]["parameter"]["ALLSKY_SFC_LW_DWN"][i] == -999): 
    #         c += 1
    #         print(c, i)

# daily_api({"latitude": "80", "longitude": "13"}, {"date": 3, "month": 9, "year": 2022})

def monthly_api(location):
    parameters = "ALLSKY_SFC_LW_DWN"
    request = "https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=" + parameters + "&community=RE&longitude=" + location["longitude"] + "&latitude=" + location["latitude"] + "&format=JSON&start=2000&end=2020"

    response = requests.get(request).json()
    print(response["properties"]["parameter"]["ALLSKY_SFC_LW_DWN"])

# monthly_api({"latitude": "80", "longitude": "13"})


def get_next_date(date, month, year):

    if month in [1, 3, 5, 7, 8, 10, 12]:
        max_days = 31
    elif month in [4, 6, 9, 11]:
        max_days = 30
    else:
        if (year % 4) == 0:
            if (year % 100) == 0:
                if (year % 400) == 0:
                    max_days = 29
                else:
                    max_days = 28
            else:
                max_days = 29
        else:
            max_days = 28
    
    if date == max_days:
        date = 1
        if month == 12:
            month = 1
            year += 1
        else:
            month += 1
    else:
        date += 1
    
    return date, month, year

print(get_next_date(31, 12, 2022))


def get_next_month (month, year):

    if month == 12:
        month = 1
        year += 1
    else:
        month += 1

    return month, year

print(get_next_month(12, 2022))