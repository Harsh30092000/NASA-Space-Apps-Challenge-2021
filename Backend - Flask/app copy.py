from flask import Flask, render_template, url_for, request, redirect, jsonify
from flask_cors import CORS
from monthly import monthly_api
from daily import daily_api
from monthly_temp import monthly_api_temp
from daily_temp import daily_api_temp
from power import calculate_total_power
import requests
from additionals import *

app = Flask(__name__)
CORS(app)


@app.route("/<lat>/<lon>")
def feasiblity(lat, lon):

    # parameters = "ALLSKY_SFC_SW_DWN"
    # request = "https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=" + parameters + "&community=RE&longitude=" + location["longitude"] + "&latitude=" + location["latitude"] + "&format=JSON&start=2019&end=2020"
    # response = requests.get(request).json()
    parameters = "ALLSKY_SFC_SW_DWN"
    location = {"longitude": str(lon), "latitude": str(lat)}
    request = "https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=" + parameters + "&community=RE&longitude=" + \
        location["longitude"] + "&latitude=" + \
        location["latitude"] + "&format=JSON&start=2019&end=2020"
    print(request)
    response = requests.get(request).json()

    year = '2020'
    values = response['properties']['parameter']['ALLSKY_SFC_SW_DWN'][year+'13']

    power = calculate_total_power({
        "type": "daily",
        "user_data": {
                "type": "wattage",
                "panel_wattage": 4000
        },
        "pred_value": values*365
    })
    status = "success"
    if(values >= 6):
        rate = '2'
    elif(values >= 3.5 and values < 6):
        rate = '1'
    else:
        rate = '0'
        status = "fail"

    return {
        "status": status,  # fail
        "rate": rate,  # 0,1,2
        "amount": power  # 0,1,2,3,4
    }


@app.route('/wattage/<lat>/<lon>/<year>/<month>/<date>/<wattage>')
def wattage(lat, lon, year, month, date, wattage):

    # power
    daily = daily_api(
        {"latitude": lat, "longitude": lon},
        {"date": int(date), "month": int(month), "year": int(year)},
        {"type": "wattage", "panel_wattage": int(wattage)}
    )

    monthly_annual = monthly_api(
        {"latitude": lat, "longitude": lon},
        {"month": int(month), "year": int(year)},
        {"type": "wattage", "panel_wattage": int(wattage)}
    )

    months_taken = 0
    monthly = {}
    for year in monthly_annual["display"]:
        if months_taken == 3:
            break
        for month1 in monthly_annual["display"][year]:
            if(months_taken == 3):
                break
            months_taken += 1
            monthly[month1] = monthly_annual["display"][year][month1]

    yearly = {}
    for year in monthly_annual["display"]:
        sum = 0
        for month1 in monthly_annual["display"][year]:
            sum += monthly_annual["display"][year][month1]
        yearly[year] = sum

    print({"date": int(date), "month": int(month), "year": int(year)})
    # #Temperature
    daily_temp = daily_api_temp(
        {"latitude": lat, "longitude": lon},
        {"date": int(date), "month": int(month), "year": int(year)},
        {"type": "wattage", "panel_wattage": 4000}
    )

    monthly_annual_temp = monthly_api_temp(
        {"latitude": lat, "longitude": lon},
        {"month": int(month), "year": int(year)},
        {"type": "efficiency", "panel_area": 16, "panel_efficiency": 15}
    )

    months_taken = 0
    monthly_temp = {}
    for year in monthly_annual_temp["display"]:
        if months_taken == 3:
            break
        for month2 in monthly_annual_temp["display"][year]:
            if(months_taken == 3):
                break
            months_taken += 1
            monthly_temp[month2] = monthly_annual_temp["display"][year][month2]

    yearly_temp = {}
    for year in monthly_annual_temp["display"]:
        sum = 0
        for month1 in monthly_annual_temp["display"][year]:
            sum += monthly_annual_temp["display"][year][month1]
        yearly_temp[year] = sum

    result = {
        'power': {
            "next3days": daily["display"],
            "next3months": monthly,
            "next3years": yearly,
            "chart": {
                "daily": daily["chart"],
                "monthly": monthly_annual["chart"]["monthly"],
                "yearly": monthly_annual["chart"]["yearly"]
            }
        },

        'temperature': {
            "next3days": daily_temp["display"],
            "next3months": monthly_temp,
            "next3years": yearly_temp,
            "chart": {
                "daily": daily_temp["chart"],
                "monthly": monthly_annual_temp["chart"]["monthly"],
                "yearly": monthly_annual_temp["chart"]["yearly"]
            }
        }
    }

    return result


@app.route('/efficiency/<lat>/<lon>/<year>/<month>/<date>/<area>/<efficiency>')
def efficiency(lat, lon, year, month, date, area, efficiency):

    print((lat, lon, year, month, date, area, efficiency))

    daily = daily_api(
        {"latitude": lat, "longitude": lon},
        {"date": int(date), "month": int(month), "year": int(year)},
        {"type": "efficiency", "panel_area": int(
            area), "panel_efficiency": int(efficiency)}
    )

    monthly_annual = monthly_api(
        {"latitude": lat, "longitude": lon},
        {"month": int(month), "year": int(year)},
        {"type": "efficiency", "panel_area": int(area),
         "panel_efficiency": int(efficiency)}
    )

    months_taken = 0
    monthly = {}
    for year in monthly_annual["display"]:
        if months_taken == 3:
            break
        for month1 in monthly_annual["display"][year]:
            if(months_taken == 3):
                break
            months_taken += 1
            monthly[month1] = monthly_annual["display"][year][month1]

    yearly = {}
    for year in monthly_annual["display"]:
        sum = 0
        for month1 in monthly_annual["display"][year]:
            sum += monthly_annual["display"][year][month1]
        yearly[year] = sum

    # temperature
    daily_temp = daily_api_temp(
        {"latitude": lat, "longitude": lon},
        {"date": int(date), "month": int(month), "year": int(year)},
        {"type": "wattage", "panel_wattage": 4000}
    )
    monthly_annual_temp = monthly_api_temp(
        {"latitude": lat, "longitude": lon},
        {"month": int(month), "year": int(year)},
        {"type": "efficiency", "panel_area": 16, "panel_efficiency": 15}
    )

    months_taken = 0
    monthly_temp = {}
    for year in monthly_annual_temp["display"]:
        if months_taken == 3:
            break
        for month1 in monthly_annual_temp["display"][year]:
            if(months_taken == 3):
                break
            months_taken += 1
            monthly_temp[month1] = monthly_annual_temp["display"][year][month1]

    yearly_temp = {}
    for year in monthly_annual_temp["display"]:
        sum = 0
        for month1 in monthly_annual_temp["display"][year]:
            sum += monthly_annual_temp["display"][year][month1]
        yearly_temp[year] = sum

    result = {
        'power': {
            "next3days": daily["display"],
            "next3months": monthly,
            "next3years": yearly,
            "chart": {
                "daily": daily["chart"],
                "monthly": monthly_annual["chart"]["monthly"],
                "yearly": monthly_annual["chart"]["yearly"]
            }
        },
        'temperature': {
            "next3days": daily_temp["display"],
            "next3months": monthly_temp,
            "next3years": yearly_temp,
            "chart": {
                "daily": daily_temp["chart"],
                "monthly": monthly_annual_temp["chart"]["monthly"],
                "yearly": monthly_annual_temp["chart"]["yearly"]
            }
        }
    }

    return result


@app.route('/compare/wattage/y/<lat>/<lon>/<year>/<wattage>/<personal_power>')
def compare_wattage_y(lat, lon, year, wattage, personal_power):
    data = get_per_year(lon, lat, year, wattage)
    difference_percentage = 100 - \
        (int(personal_power)/data["total_power"]) * 100
    print(difference_percentage)
    comment = "Your Panel is operating at optimal efficiency"
    if(difference_percentage >= 20):
        comment = "Your Panel is not working as expected"
    print(wattage)
    return {
        "location": {
            "latitude": lat,
            "longitude": lon,
        },
        "year": year,
        "NASA": {
            "irradiance": data["total_irr"],
            "power": data["total_power"]
        },
        "personal": {
            "wattage": int(wattage),
            "power": personal_power
        },
        "comment": comment
    }


@app.route('/compare/efficiency/y/<lat>/<lon>/<year>/<area>/<efficiency>/<personal_power>')
def compare_efficiency_y(lat, lon, year, area, efficiency, personal_power):
    data = get_per_year_compare_efficiency(lon, lat, year, area, efficiency)
    difference_percentage = 100 - \
        (int(personal_power)/data["total_power"]) * 100
    print(difference_percentage)
    comment = "Your Panel is operating at optimal efficiency"
    if(difference_percentage >= 20):
        comment = "Your Panel is not working as expected"

    return {
        "location": {
            "latitude": lat,
            "longitude": lon,
        },
        "year": year,
        "NASA": {
            "irradiance": data["total_irr"],
            "power": data["total_power"]
        },
        "personal": {
            "wattage": int(area)*int(efficiency)/100,
            "power": personal_power
        },
        "comment": comment
    }


@app.route('/compare/wattage/my/<lat>/<lon>/<month>/<year>/<wattage>/<personal_power>')
def compare_wattage_my(lat, lon, month, year, wattage, personal_power):
    data = get_per_month_year_compare_wattage(lon, lat, month, year, wattage)
    cv = get_days(int(month), int(year))
    power_day = data["total_power"]*cv
    difference_percentage = 100 - \
        (int(personal_power)/power_day) * 100
    print(difference_percentage)
    comment = "Your Panel is operating at optimal efficiency"
    if(difference_percentage >= 20):
        comment = "Your Panel is not working as expected"
    return {
        "location": {
            "latitude": lat,
            "longitude": lon,
        },
        "year": year,
        "month": month,
        "NASA": {
            "irradiance": data["total_irr"]*cv,
            "power": power_day
        },
        "personal": {
            "wattage": int(wattage)/1000,
            "power": personal_power
        },
        "comment": comment
    }


@app.route('/compare/efficiency/my/<lat>/<lon>/<month>/<year>/<area>/<efficiency>/<personal_power>')
def compare_efficiency_my(lat, lon, month, year, area, efficiency, personal_power):
    data = get_per_month_year_compare_efficiency(
        lon, lat, month, year, area, efficiency)
    cv = get_days(int(month), int(year))
    power_day = data["total_power"]*cv
    difference_percentage = 100 - \
        (int(personal_power)/power_day) * 100
    print(difference_percentage)
    comment = "Your Panel is operating at optimal efficiency"
    if(difference_percentage >= 20):
        comment = "Your Panel is not working as expected"
    return {
        "location": {
            "latitude": lat,
            "longitude": lon,
        },
        "month": month,
        "year": year,
        "NASA": {
            "irradiance": data["total_irr"]*cv,
            "power": power_day
        },
        "personal": {
            "wattage": int(area)*int(efficiency)/100,
            "power": personal_power
        },
        "comment": comment
    }


@app.route('/last1year/<lat>/<lon>/<year>/<wattage>/')
def last1year(lat, lon, year, wattage):
    request = "https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude=" + \
        lon + "&latitude=" + lat + "&format=JSON&start=" + \
        year + "&end=" + year
    response = requests.get(request).json()
    # return response

    values = []
    for i in response["properties"]["parameter"]["ALLSKY_SFC_SW_DWN"]:
        if i[4:] != "13":
            print(i)
            values.append(calculate_total_power({
                "type": "monthly",
                "user_data": {
                        "type": "wattage",
                    "panel_wattage": int(wattage)*1000,
                },
                "month": int(i[4:]),
                "year": int(i[:4]),
                "pred_value": response["properties"]
                ["parameter"]["ALLSKY_SFC_SW_DWN"][i]
            }))

    return {
        "data": values
    }


if(__name__ == "__main__"):
    app.run(debug=True)
