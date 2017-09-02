"""This script gathers data from the sense hat."""
from sense_hat import SenseHat
from datetime import datetime
import json

sense = SenseHat()

TEMPERATURE = sense.get_temperature_from_humidity()
# TEMPERATURE2 = sense.get_temperature_from_pressure()
PRESSURE = sense.get_pressure()
HUMIDITY = sense.get_humidity()

TEMPERATURE = round(TEMPERATURE, 2)
# TEMPERATURE2 = round(TEMPERATURE2, 2)
PRESSURE = round(PRESSURE, 2)
HUMIDITY = round(HUMIDITY, 2)


JSON = {"temperature": TEMPERATURE, "humidity": HUMIDITY, "pressure": PRESSURE, "creation_date": datetime.now().isoformat()}

print(json.dumps(JSON, ensure_ascii=False))