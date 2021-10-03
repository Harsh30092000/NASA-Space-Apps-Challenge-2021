def get_days(month, year):
    if month in [1, 3, 5, 7, 8, 10, 12]:
        return 31
    elif month in [4, 6, 9, 11]:
        return 30
    else:
        if (year % 4) == 0:
            if (year % 100) == 0:
                if (year % 400) == 0:
                    return 29
                else:
                    return 28
            else:
                return 29
        else:
            return 28


def calculate_total_power(data):
    # print(data)
    if (data["user_data"]["type"] == "wattage"):
        power = data["pred_value"] * \
            (data["user_data"]["panel_wattage"] / 1000)
    else:
        power = data["pred_value"] * int(data["user_data"]["panel_area"]) * \
            (int(data["user_data"]["panel_efficiency"]) / 100)
    if (data["type"] == "monthly"):
        total_power = power * get_days(data["month"], data["year"])
    else:
        total_power = power
    return total_power


def power_temp(power,temp):
    gamma = 0.258
    if(temp > 25):
        change_temp = temp-25
        total_percent = change_temp * gamma
        new_power = power - (total_percent/100) * power
        return new_power
    else:
        return power


# calculate_total_power({
#     "type": "monthly",
#     "user_data": {
#         "type": "wattage",
#         "panel_wattage": 4000
#     },
#     "pred_value": 5,
#     "month": 12,
#     "year": 2019
# })

# calculate_total_power({
#     "type": "monthly",
#     "user_data": {
#         "type": "efficiency",
#         "panel_area": 16,
#         "panel_efficiency": 15
#     },
#     "pred_value": 5,
#     "month": 12,
#     "year": 2019
# })

# calculate_total_power({
#     "type": "daily",
#     "user_data": {
#         "type": "wattage",
#         "panel_wattage": 4000
#     },
#     "pred_value": 5
# })

# calculate_total_power({
#     "type": "daily",
#     "user_data": {
#         "type": "efficiency",
#         "panel_area": 16,
#         "panel_efficiency": 15
#     },
#     "pred_value": 5
# })
