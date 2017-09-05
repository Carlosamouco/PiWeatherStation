"""This script gathers data from the sense hat."""
from sense_hat import SenseHat
from datetime import datetime
from time import sleep
import json

sense = SenseHat()

tempList = []
# temp2List = []
presList = []
humList = []

for i in range(0, 6):
    TEMPERATURE = sense.get_temperature_from_humidity()
    # TEMPERATURE2 = sense.get_temperature_from_pressure()
    PRESSURE = sense.get_pressure()
    
    if PRESSURE == 0:
	PRESSURE = sense.get_pressure()

    HUMIDITY = sense.get_humidity()

    TEMPERATURE = round(TEMPERATURE, 2)
    # TEMPERATURE2 = round(TEMPERATURE2, 2)
    PRESSURE = round(PRESSURE, 2)
    HUMIDITY = round(HUMIDITY, 2)
    
    tempList.append(TEMPERATURE)
    # temp2List.append(TEMPERATURE2)
    presList.append(PRESSURE)
    humList.append(HUMIDITY)
    
    sleep(0.05)


TEMPERATURE = round(sum(tempList) / len(tempList), 2)
# TEMPERATURE2 = round(sum(temp2List) / len(temp2List), 2)
PRESSURE = round(sum(presList) / len(presList), 2)
HUMIDITY = round(sum(humList) / len(humList), 2)

# print(TEMPERATURE2)

JSON = {
    "temperature": TEMPERATURE,
    "humidity": HUMIDITY,
    "pressure": PRESSURE,
    "creation_date": datetime.now().isoformat() + 'Z'
}

print(json.dumps(JSON, ensure_ascii=False))
