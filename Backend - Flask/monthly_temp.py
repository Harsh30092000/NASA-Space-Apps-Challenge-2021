import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
# from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
# from sklearn.linear_model import LinearRegression
# import xgboost as xgb
# from sklearn.svm import SVR
# from lightgbm import LGBMRegressor
import requests
from power import calculate_total_power

def generateLast12Months(month, year):
    last12Months = []
    for i in range(12):
        last12Months.append(str(year) + str(month).zfill(2))
        month, year = get_prev_month(month, year)
    return last12Months

def get_prev_month (month, year):

    if month == 1:
        month = 12
        year -= 1
    else:
        month -= 1

    return month, year

def get_next_month (month, year):

    if month == 12:
        month = 1
        year += 1
    else:
        month += 1

    return month, year

def monthly_api_temp(location, end_date, user_data):

    # Getting the data from the API
    parameters = "T2M_MAX"
    request = "https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=" + parameters + "&community=RE&longitude=" + location["longitude"] + "&latitude=" + location["latitude"] + "&format=JSON&start=2000&end=2020"
    response = requests.get(request).json()
    print("Received Data")
    print(request)

    # Creating the dataframe
    series = pd.Series(response["properties"]["parameter"]["T2M_MAX"])
    df = pd.DataFrame(series)

    # Data Preprocessing
    df.reset_index(inplace=True)
    df.rename(columns={0:'value','index':'date'}, inplace=True)
    df['date']=df['date']+'01'

    drop_list=[]
    for i in range (len(df)):
        if '13' in df.iloc[i,0][4:]:
            drop_list.append(i)
    df=df.drop(drop_list)

    df.reset_index(inplace=True)
    df['date']=pd.to_datetime(df['date'],format='%Y%m%d')

    # Feature Engineering
    df['month'] = df['date'].dt.month
    df['year'] = df['date'].dt.year
    df.drop(columns='date',inplace=True)
    df.drop(columns='index',inplace=True)
    
    # Splitting the data into training and testing
    X = df.drop(columns=['value'])
    y = df['value']
    X_train,X_test,y_train,y_test=train_test_split(X,y,test_size=0.2,random_state=0,shuffle=False)
    print("Preprocessed Data")

    # Training the models
    # lr = LinearRegression()
    # lr.fit(X_train, y_train)
    # predicted1 = lr.predict(X_test)

    rf = RandomForestRegressor(max_depth=9) #96%
    rf.fit(X_train, y_train)
    predicted5 =rf.predict(X_test)
    print(predicted5)

    # dt = DecisionTreeRegressor()
    # dt.fit(X_train, y_train)
    # predicted2 = dt.predict(X_test)

    # svr = SVR()
    # svr.fit(X_train, y_train)
    # predicted3= svr.predict(X_test)

    # lgbm = LGBMRegressor()
    # lgbm.fit(X_train, y_train)
    # predicted6 = lgbm.predict(X_test)

    print("Trained Models")

    # errors = abs(predicted5 - y_test)
    # mape = np.mean(100 * (errors / y_test))
    # accuracy = 100 - mape
    # print(accuracy)

    # Predicting for future dates
    year = 0
    c_month, c_year = end_date["month"], end_date["year"]
    # 09/2020
    display_result = {}

    while year < 3:
        res = {}
        flag = True
        while(flag):
            predicted_value = rf.predict([[c_month, c_year]])

            res_key = str(c_year) + str(c_month).zfill(2)
            res[res_key] = predicted_value[0]

            if c_month == 12:
                flag = False
            c_month, c_year = get_next_month(c_month, c_year)
    
        display_result[c_year-1] = res
        year += 1
        flag = True

    monthly_chart_result_keys = generateLast12Months(end_date["month"], end_date["year"])
    monthly_chart_result_values = []
    for key in monthly_chart_result_keys:
        # key = "202109" [[c_month, c_year]]
        predicted_value = rf.predict([[int(key[4:]), int(key[:4])]])
        monthly_chart_result_values.append(predicted_value[0])

    yearly_chart_result_keys= []
    yearly_chart_result_values = []
    for i in range(end_date["year"], end_date["year"]-10, -1):
        # print(i)
        sum = 0
        for j in range(12):
            predicted_value = rf.predict([[j, i]])
            sum += predicted_value[0]

        yearly_chart_result_keys.append(i)
        yearly_chart_result_values.append(sum)

    chart_result = {
        "monthly": {
            "keys": monthly_chart_result_keys,
            "values": monthly_chart_result_values
        },
        "yearly": {
            "keys": yearly_chart_result_keys,
            "values": yearly_chart_result_values
        }
    }

    print(display_result)

    final_result = {
        "display": display_result,
        "chart": chart_result
    }

    return final_result
