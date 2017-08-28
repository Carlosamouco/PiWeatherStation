"""This is a teste script."""
from random import uniform
import json

TEMPERATURE = uniform(-20.0, 45.0)
HUMIDITY = uniform(0.0, 100.0)
PRESSURE = uniform(950.0, 1150.0)

JSON = {"temperature": TEMPERATURE, "humidity": HUMIDITY, "pressure": PRESSURE,}

print(json.dumps(JSON, ensure_ascii=False))
