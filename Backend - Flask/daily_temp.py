import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.svm import SVR
import requests
import matplotlib.pyplot as plt
from power import calculate_total_power


def generateLast30Days(year, month, date):
    res = []
    for i in range(15):
        res.append(str(date).zfill(2) + str(month).zfill(2) + str(year))
        date, month, year = get_prev_date(date, month, year)
    return res


def get_prev_date(date, month, year):
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

    if date == 1:
        date = max_days
        if month == 1:
            month = 12
            year -= 1
        else:
            month -= 1
    else:
        date -= 1

    return date, month, year


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


def daily_api_temp(location, end_date, user_data):

    # Getting the data from the API
    parameters = "T2M_MAX"
    start_date = "2000" + \
        str(end_date["month"]).zfill(2) + str(end_date["date"]).zfill(2)
    end_date = str(end_date["year"]) + str(end_date["month"]
                                           ).zfill(2) + str(end_date["date"]).zfill(2)
    date = {"start_date": start_date, "end_date": end_date}
    request = "https://power.larc.nasa.gov/api/temporal/daily/point?parameters=" + parameters + "&community=RE&longitude=" + \
        location["longitude"] + "&latitude=" + location["latitude"] + "&start=" + \
        date["start_date"] + "&end=" + date["end_date"] + "&format=JSON"
    response = requests.get(request).json()
    print(request)
    print("Received Data")

    # Creating the dataframe
    series = pd.Series(response["properties"]
                       ["parameter"]["T2M_MAX"])
    df = pd.DataFrame(series)

    # Data Preprocessing
    df.drop(df.tail(15).index, inplace=True)
    df.reset_index(inplace=True)
    df.rename(columns={0: 'value', 'index': 'date'}, inplace=True)
    df['date'] = pd.to_datetime(df['date'], format='%Y%m%d')

    # Feature Engineering
    df['day'] = df['date'].dt.day
    df['month'] = df['date'].dt.month
    df['year'] = df['date'].dt.year
    df.drop(columns='date', inplace=True)

    # Splitting the data into training and testing
    X = df.drop(columns=['value'])
    y = df['value']
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=0, shuffle=False)
    print("Preprocessed Data")

    # Training the models
    rf = RandomForestRegressor(max_depth=9)
    rf.fit(X_train, y_train)
    predicted5 = rf.predict(X_test)

    svr = SVR()
    svr.fit(X_train, y_train)
    predicted3 = svr.predict(X_test)

    print("Trained Models")

    # random forest regressor - 95%

    # errors = abs(predicted5 - y_test)
    # mape = np.mean(100 * (errors / y_test))
    # accuracy = 100 - mape
    # print("Random Forest",accuracy)

    # SVR - 29%

    # score = svr.score(X_test,y_test)
    # print("SVR",score)

    # Predicting for future dates
    days = 0
    c_date, c_month, c_year = int(end_date[6:]), int(
        end_date[4:6]), int(end_date[:4])
    display_result = {}

    while days < 3:
        predicted_value = rf.predict([[c_date, c_month, c_year]])
        # print(predicted_value)

        result_key = str(c_year) + str(c_month).zfill(2) + str(c_date).zfill(2)
        display_result[result_key] = predicted_value[0]

        days += 1
        c_date, c_month, c_year = get_next_date(c_date, c_month, c_year)

    daily_chart_result_keys = generateLast30Days(
        int(end_date[:4]), int(end_date[4:6]), int(end_date[6:]))
    daily_chart_result_values = []
    for i in daily_chart_result_keys:
        predicted_value = rf.predict([[int(i[:2]), int(i[2:4]), int(i[4:])]])
        daily_chart_result_values.append(predicted_value[0])

    final_result = {
        "display": display_result,
        "chart": {
            "keys": daily_chart_result_keys,
            "values": daily_chart_result_values
        }
    }

    return final_result


# daily = daily_api_temp(
#         {"latitude": "13", "longitude": "80"},
#         {"date": 20, "month": 12, "year": 2020},
#         {"type": "wattage", "panel_wattage": 4000}
#     )

# print(daily)
