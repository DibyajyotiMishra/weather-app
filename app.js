require("dotenv").config();

const app = require("express")();
const request = require("request");
const geoip = require("geoip-lite");
const expressIp = require("express-ip");
const PORT = process.env.PORT || 8000;

app.use(expressIp().getIpInfoMiddleware);

app.get("/", (req, res) => {
  const ip = req.ipInfo.ip; //Get user's ip
  const geo = geoip.lookup(ip); //Look up for user's location
  var city = geo.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.KEY}`;
  // Display the temperature
  request(url, (err, response, body) => {
    if (err) {
      console.log(err);
    }
    let weather = JSON.parse(body);
    let temp = `${weather.main.temp}`;
    let feel = `${weather.main.feels_like}`;
    let pressure = `${weather.main.pressure}`;
    let humidity = `${weather.main.humidity}`;
    let wind = `${weather.wind.speed}`;
    return res.json({
      "Your city": city,
      "Temperature in celsius": temp,
      "Feels Like": feel,
      "Pressure in hPA": pressure,
      "Humidity Percentage": humidity,
      "Wind Speed in m/s": wind,
    });
  });
});

app.listen(PORT, () => {
  console.log(`APP IS RUNNING AT PORT: ${PORT}`);
});
