from flask import Flask, render_template, url_for, request, redirect, jsonify
from flask_cors import CORS
from monthly import monthly_api
from daily import daily_api
from monthly_temp import monthly_api_temp
from daily_temp import daily_api_temp
from power import*
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
    for year1 in monthly_annual["display"]:
        if months_taken == 3:
            break
        for month1 in monthly_annual["display"][year1]:
            if(months_taken == 3):
                break
            months_taken += 1
            monthly[month1] = monthly_annual["display"][year1][month1]

    yearly = {}
    for year1 in monthly_annual["display"]:
        sum = 0
        for month1 in monthly_annual["display"][year1]:
            sum += monthly_annual["display"][year1][month1]
        yearly[year1] = sum

    #print({"date": int(date), "month": int(month), "year": int(year)})
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
    # print(monthly_annual_temp["display"])
    for year1 in monthly_annual_temp["display"]:
        if months_taken == 3:
            break
        for month1 in monthly_annual_temp["display"][year1]:
            if(months_taken == 3):
                break
            months_taken += 1
            monthly_temp[month1] = monthly_annual_temp["display"][year1][month1]

    yearly_temp = {}
    for year1 in monthly_annual_temp["display"]:
        sum = 0
        for month1 in monthly_annual_temp["display"][year1]:
            sum += monthly_annual_temp["display"][year1][month1]
        yearly_temp[year1] = sum

    print("power ---> ", monthly)
    print("temp ---> ", monthly_temp)

    daily_ptemp = {
        "display": {},
        "chart": {
            "keys": daily["chart"]["keys"],
            "values": []
        }
    }

    monthly_annual_ptemp = {
        "display": {},
        "chart": {
            "monthly": {
                "keys": monthly_annual["chart"]["monthly"]["keys"],
                "values": []
            },
            "yearly": {
                "keys": monthly_annual["chart"]["yearly"]["keys"],
                "values": []
            }
        }
    }

    for i in range(12):
        mon = int(monthly_annual_temp["chart"]["monthly"]["keys"][i][4:])
        yr = int(monthly_annual_temp["chart"]["monthly"]["keys"][i][:4])
        day = get_days(mon, yr)
        val = power_temp(monthly_annual["chart"]["monthly"]["values"][i]/day, monthly_annual_temp["chart"]["monthly"]["values"][i])*day
        print(monthly_annual_temp["chart"]["monthly"]["values"]
              [i]/day, monthly_annual["chart"]["monthly"]["values"][i]/day)

        print("------------------------>", val)
        monthly_annual_ptemp["chart"]["monthly"]["values"].append(val)

    for i in range(10):
        val = power_temp(monthly_annual["chart"]["yearly"]["values"][i]/365,
            monthly_annual_temp["chart"]["yearly"]["values"][i]/12)*365
        monthly_annual_ptemp["chart"]["yearly"]["values"].append(val)

    for i in daily["display"]:
        daily_ptemp["display"][i] = power_temp(
            daily["display"][i], daily_temp["display"][i])

    for i in range(15):
        daily_ptemp["chart"]["values"].append(power_temp(
            daily["chart"]["values"][i], daily_temp["chart"]["values"][i]))

    monthly_ptemp = {}
    for i in monthly:
        mon = int(i[4:])
        yr = int(i[:4])
        day = get_days(mon, yr)
        monthly_ptemp[i] = power_temp(monthly[i]/day, monthly_temp[i]) * day

    yearly_ptemp = {}
    c = 0
    for i in yearly:
        if(c == 0):
            rem_mon = 12 - int(month)
        else:
            rem_mon = 12
        yearly_ptemp[i] = power_temp(
            yearly[i]/365, yearly_temp[i]/rem_mon) * 365
        c = c + 1

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
            "next3days": daily_ptemp["display"],
            "next3months": monthly_ptemp,
            "next3years": yearly_ptemp,
            "chart": {
                "daily": daily_ptemp["chart"],
                "monthly": monthly_annual_ptemp["chart"]["monthly"],
                "yearly": monthly_annual_ptemp["chart"]["yearly"]

            }
        }
    }

    return result


@app.route('/efficiency/<lat>/<lon>/<year>/<month>/<date>/<area>/<efficiency>')
def efficiency(lat, lon, year, month, date, area, efficiency):

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
    for year1 in monthly_annual["display"]:
        if months_taken == 3:
            break
        for month1 in monthly_annual["display"][year1]:
            if(months_taken == 3):
                break
            months_taken += 1
            monthly[month1] = monthly_annual["display"][year1][month1]

    yearly = {}
    for year1 in monthly_annual["display"]:
        sum = 0
        for month1 in monthly_annual["display"][year1]:
            sum += monthly_annual["display"][year1][month1]
        yearly[year1] = sum

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
    # print(monthly_annual_temp["display"])
    for year1 in monthly_annual_temp["display"]:
        if months_taken == 3:
            break
        for month1 in monthly_annual_temp["display"][year1]:
            if(months_taken == 3):
                break
            months_taken += 1
            monthly_temp[month1] = monthly_annual_temp["display"][year1][month1]

    yearly_temp = {}
    for year1 in monthly_annual_temp["display"]:
        sum = 0
        for month1 in monthly_annual_temp["display"][year1]:
            sum += monthly_annual_temp["display"][year1][month1]
        yearly_temp[year1] = sum

    print("power ---> ", monthly)
    print("temp ---> ", monthly_temp)

    daily_ptemp = {
        "display": {},
        "chart": {
            "keys": daily["chart"]["keys"],
            "values": []
        }
    }

    monthly_annual_ptemp = {
        "display": {},
        "chart": {
            "monthly": {
                "keys": monthly_annual["chart"]["monthly"]["keys"],
                "values": []
            },
            "yearly": {
                "keys": monthly_annual["chart"]["yearly"]["keys"],
                "values": []
            }
        }
    }

    for i in range(12):
        mon = int(monthly_annual_temp["chart"]["monthly"]["keys"][i][4:])
        yr = int(monthly_annual_temp["chart"]["monthly"]["keys"][i][:4])
        day = get_days(mon, yr)
        val = power_temp(monthly_annual["chart"]["monthly"]["values"][i]/day, monthly_annual_temp["chart"]["monthly"]["values"][i])*day
        print(monthly_annual_temp["chart"]["monthly"]["values"]
              [i]/day, monthly_annual["chart"]["monthly"]["values"][i]/day)

        print("------------------------>", val)
        monthly_annual_ptemp["chart"]["monthly"]["values"].append(val)

    for i in range(10):
        val = power_temp(monthly_annual["chart"]["yearly"]["values"][i]/365,
            monthly_annual_temp["chart"]["yearly"]["values"][i]/12)*365
        monthly_annual_ptemp["chart"]["yearly"]["values"].append(val)

    for i in daily["display"]:
        daily_ptemp["display"][i] = power_temp(
            daily["display"][i], daily_temp["display"][i])

    for i in range(15):
        daily_ptemp["chart"]["values"].append(power_temp(
            daily["chart"]["values"][i], daily_temp["chart"]["values"][i]))

    monthly_ptemp = {}
    for i in monthly:
        mon = int(i[4:])
        yr = int(i[:4])
        day = get_days(mon, yr)
        monthly_ptemp[i] = power_temp(monthly[i]/day, monthly_temp[i]) * day

    yearly_ptemp = {}
    c = 0
    for i in yearly:
        if(c == 0):
            rem_mon = 12 - int(month)
        else:
            rem_mon = 12
        yearly_ptemp[i] = power_temp(
            yearly[i]/365, yearly_temp[i]/rem_mon) * 365
        c = c + 1

    comment = {
        # months_taken = 0
        # monthly_temp = {}
        # for year in monthly_annual_temp["display"]:
        #     if months_taken == 3:
        #         break
        #     for month1 in monthly_annual_temp["display"][year]:
        #         if(months_taken == 3):
        #             break
        #         months_taken += 1
        #         monthly_temp[month1] = monthly_annual_temp["display"][year][month1]

        # yearly_temp = {}
        # for year in monthly_annual_temp["display"]:
        #     sum = 0
        #     for month1 in monthly_annual_temp["display"][year]:
        #         sum += monthly_annual_temp["display"][year][month1]
        #     yearly_temp[year] = sum

        # print(yearly_temp) # next 3 years
        # print("Hekko")
        # print(monthly_annual_temp)

        # with temp daily
        # daily_power_h = daily["chart"]["values"]
        # daily_temp_h = daily_temp["chart"]["values"]
        # daily_temp_result_h = []
        # for i, j in zip(daily_power_h, daily_temp_h):
        #     z = power_temp(j, i)
        #     daily_temp_result_h.append(z)

        # monthly_power_h = monthly_annual["chart"]["monthly"]["values"]
        # print("hello")
        # print(monthly_temp)
        # monthly_temp_h = monthly_annual_temp["chart"]["monthly"]["values"]
        # monthly_temp_result_h = []
        # for i, j in zip(monthly_power_h, monthly_temp_h):
        #     z = power_temp(j, i)
        #     monthly_temp_result_h.append(z)

        # yearly_power_h = yearly["chart"]["values"]
        # yearly_temp_h = yearly["chart"]["values"]
        # yearly_temp_result_h = []
        # for i, j in zip(yearly_power, yearly_temp):
        #     z = power_temp(j, i)
        #     yearly_temp_result_h.append(z)
    }

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
            "next3days": daily_ptemp["display"],
            "next3months": monthly_ptemp,
            "next3years": yearly_ptemp,
            "chart": {
                "daily": daily_ptemp["chart"],
                "monthly": monthly_annual_ptemp["chart"]["monthly"],
                "yearly": monthly_annual_ptemp["chart"]["yearly"]

            }
        }
    }

    return result


@app.route('/compare/wattage/y/<lat>/<lon>/<year>/<wattage>/<personal_power>')
def compare_wattage_y(lat, lon, year, wattage, personal_power):
    data = get_per_year(lon, lat, year, wattage)
    difference_percentage = 100 - \
        (int(personal_power)/data["total_power"]) * 100
    # print(difference_percentage)
    comment = "Your Panel is operating at optimal efficiency"
    if(difference_percentage >= 20):
        comment = "Your Panel is not working as expected"
    # print(wattage)
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
    # print(difference_percentage)
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
    # print(difference_percentage)
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
    # print(difference_percentage)
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
            # print(i)
            values.append(calculate_total_power({
                "type": "monthly",
                "user_data": {
                        "type": "wattage",
                    "panel_wattage": float(wattage)*1000,
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
