from power import get_days, calculate_total_power
import requests


def get_per_year(lon, lat, year, wattage):
    parameters = "ALLSKY_SFC_SW_DWN"
    location = {"longitude": lon, "latitude": lat}
    request = "https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=" + parameters + "&community=RE&longitude=" + \
        location["longitude"] + "&latitude=" + location["latitude"] + \
        "&format=JSON&start=" + year + "&end=" + year
    response = requests.get(request).json()
    print(response)
    values = response['properties']['parameter']['ALLSKY_SFC_SW_DWN']

    total_irr = 0
    total_power = 0
    for i in values:
        if i[4:] != "13":
            z = get_days(int(i[:4]), int(i[4:]))
            total_val = values[i] * z
            total_irr = total_irr + total_val
            total_power += calculate_total_power({
                "type": "monthly",
                "user_data": {
                    "type": "wattage",
                    "panel_wattage": int(wattage),
                },
                "month": int(i[4:]),
                "year": int(i[:4]),
                "pred_value": values[i]
            })

    return {
        "total_irr": total_irr,
        "total_power": total_power
    }

# print(get_per_year("80","13","2020","4000"))
#{"type": "efficiency", "panel_area": 16, "panel_efficiency": 15}


def get_per_year_compare_efficiency(lon, lat, year, area, efficiency):
    parameters = "ALLSKY_SFC_SW_DWN"
    location = {"longitude": lon, "latitude": lat}
    request = "https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=" + parameters + "&community=RE&longitude=" + \
        location["longitude"] + "&latitude=" + location["latitude"] + \
        "&format=JSON&start=" + year + "&end=" + year
    response = requests.get(request).json()
    print(response)
    values = response['properties']['parameter']['ALLSKY_SFC_SW_DWN']

    total_irr = 0
    total_power = 0
    for i in values:
        # print(i)
        if i[4:] != "13":
            z = get_days(int(i[:4]), int(i[4:]))
            total_val = values[i] * z
            total_irr = total_irr + total_val
            total_power += calculate_total_power({
                "type": "monthly",
                "user_data": {
                    "type": "efficiency", "panel_area": area, "panel_efficiency": efficiency
                },
                "month": int(i[4:]),
                "year": int(i[:4]),
                "pred_value": values[i]
            })
            print({
                "type": "monthly",
                "user_data": {
                    "type": "efficiency", "panel_area": area, "panel_efficiency": efficiency
                },
                "month": int(i[4:]),
                "year": int(i[:4]),
                "pred_value": values[i]
            })

    return {
        "total_irr": total_irr,
        "total_power": total_power
    }


def get_per_month_year_compare_wattage(lon, lat, month, year, wattage):
    parameters = "ALLSKY_SFC_SW_DWN"
    location = {"longitude": lon, "latitude": lat}
    request = "https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=" + parameters + "&community=RE&longitude=" + \
        location["longitude"] + "&latitude=" + location["latitude"] + \
        "&format=JSON&start=" + year + "&end=" + year
    response = requests.get(request).json()
    print(response)
    values = response['properties']['parameter']['ALLSKY_SFC_SW_DWN']

    total_irr = values[year+month.zfill(2)]
    total_power = 0
    total_power = calculate_total_power({
        "type": "daily",
                "user_data": {
                    "type": "wattage",
                    "panel_wattage": int(wattage),
                },
        "month": int(month),
        "year": int(year),
        "pred_value": total_irr
    })

    return {
        "total_irr": total_irr,
        "total_power": total_power
    }


def get_per_month_year_compare_efficiency(lon, lat, month, year, area, efficiency):
    parameters = "ALLSKY_SFC_SW_DWN"
    location = {"longitude": lon, "latitude": lat}
    request = "https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=" + parameters + "&community=RE&longitude=" + \
        location["longitude"] + "&latitude=" + location["latitude"] + \
        "&format=JSON&start=" + year + "&end=" + year
    response = requests.get(request).json()
    print(response)
    values = response['properties']['parameter']['ALLSKY_SFC_SW_DWN']

    total_irr = values[year+month.zfill(2)]
    total_power = 0
    total_power = calculate_total_power({
        "type": "daily",
                "user_data": {
                    "type": "efficiency", "panel_area": area, "panel_efficiency": efficiency
                },
        "month": int(month),
        "year": int(year),
        "pred_value": total_irr
    })

    return {
        "total_irr": total_irr,
        "total_power": total_power
    }
