/** This is a bme280 simulator script. **/
const JSON_DATA = {
  temperature: Math.random() * (45.0 - -20.0) + -20.0,
  humidity: Math.random() * 100.0,
  pressure: Math.random() * (1150.0 - 950.0) + 950.0,
  creation_date: new Date().toISOString(),
};

console.log(JSON.stringify(JSON_DATA));
