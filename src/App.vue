<template>
  <div id="app" class="app">
    <div class="topLine">
      <div class="container">
        <h1 class="topLine__header">Another weather page</h1>
        <a class="topLine__logo" href="#">
          <img :src="'./src/assets/topLineIcon/' + logo + '.svg'" :alt="logo" />
        </a>
      </div>
    </div>

    <main class="weather">
      <div class="container">
        <div class="weather__today today">
          <h3 class="today__header">weather today</h3>

          <form class="today__form">
            <label for="today__input">Type a city:</label>

            <div class="today__inputBlock">
              <input
                type="text"
                name="today__input"
                id="today__input"
                placeholder="type a city"
                class="today__input"
                v-model="msg"
                @keyup.enter="getWeather"
              />
              <button class="today__btn" @click.prevent="getWeather">ok</button>
            </div>
          </form>

          <div class="today__outWrap">
            <div class="today__out">
              <div class="today__outField today__outImg today__outImg_city">
                <span class="today__span">city:</span>
                <span class="today__output today__output_city">
                  {{city}}
                  <img src alt />
                </span>
              </div>

              <div class="today__outField today__outImg today__outImg_weather">
                <span class="today__span">summary:</span>
                <span class="today__output today__output_weather">{{weather}}</span>
                <img
                  class="today__outSummary"
                  :src=" './src/assets/weatherSvg/' + summaryLogo + '.svg'"
                  :alt="summaryLogo"
                />
              </div>

              <div class="today__outField today__outImg today__outImg_temp">
                <span class="today__span">temperature:</span>
                <span class="today__output today__output_temp">
                  {{temp}}
                  <img src alt />
                </span>
              </div>
            </div>
            <!-- out -->
          </div>
          <!-- outWrap -->
        </div>
        <!-- today -->
      </div>
      <!-- container -->
      <div class="container">
        <div class="week">
          <ul class="week__list">
            <li class="week__day" v-for="day in nextWeek">
              <p class="week__dayFormat">{{day.day | formatDate}}</p>
              <p class="week__maxTemp">{{day.maxTemp}}</p>
              <p class="week__minTemp">{{day.minTemp}}</p>
              <img
                class="week__img"
                :src="'./src/assets/weatherSvg/' + day.icon + '.svg'"
                :alt="day.icon"
              />
            </li>
          </ul>
        </div>
      </div>
    </main>

    <footer></footer>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "app",
  data() {
    return {
      msg: "",
      city: "",
      weather: "",
      temp: "",
      logo: "sun",
      logoArr: ["sun", "umbrella", "storm", "rainbow", "wind", "hot", "cold"],
      summaryArr: {
        "Partly Cloudy": "sun-cloud",
        Cloudy: "clouds",
        "Mostly Cloudy": "clouds",
        Clear: "sun",
        Rain: "rain",
        Drizzle: "rain",
        "Light Sleet": "sleet",
        "Light Rain": "rain",
        Snow: "snow",
        "Light Snow": "snow",
        Fog: "fog"
      },
      weekObj: {
        "Partly Cloudy": "sun-cloud",
        cloudy: "clouds",
        "partly-cloudy-day": "sun-cloud",
        "partly-cloudy-night": "sun-cloud",
        "Mostly Cloudy": "clouds",
        "clear-day": "sun",
        "clear-night": "sun",
        rain: "rain",
        sleet: "sleet",
        "Light Rain": "rain",
        snow: "snow",
        Drizzle: "snow",
        "Light Snow": "snow",
        fog: "fog"
      },
      summaryLogo: "",
      nextWeek: [
        {
          icon: "",
          minTemp: "",
          maxTemp: "",
          day: ""
        },
        {
          icon: "",
          minTemp: "",
          maxTemp: "",
          day: ""
        },
        {
          icon: "",
          minTemp: "",
          maxTemp: "",
          day: ""
        },
        {
          icon: "",
          minTemp: "",
          maxTemp: "",
          day: ""
        },
        {
          icon: "",
          minTemp: "",
          maxTemp: "",
          day: ""
        },
        {
          icon: "",
          minTemp: "",
          maxTemp: "",
          day: ""
        },
        {
          icon: "",
          minTemp: "",
          maxTemp: "",
          day: ""
        },
        {
          icon: "",
          minTemp: "",
          maxTemp: "",
          day: ""
        }
      ]
    };
  },
  filters: {
    formatDate: function(value) {
      if (value) {
        return moment(String(value)).format("dddd");
      }
    }
  },

  methods: {
    changeLogo: function() {
      const rundNum = Math.floor(Math.random() * (this.logoArr.length - 1));
      this.logo = this.logoArr[rundNum];
    },
    summaryImgView: function(res) {
      const summary = res.currently.summary;
      const val = this.summaryArr[summary];
      this.summaryLogo = val;
    },
    weekForkast: function(res) {
      const data = res.daily.data;
      data.forEach((item, i) => {
        this.nextWeek[i].icon = this.weekObj[item.icon];
        this.nextWeek[i].minTemp = Math.round(
          ((item.temperatureMin - 32) * 5) / 9
        );
        this.nextWeek[i].maxTemp = Math.round(
          ((item.temperatureMax - 32) * 5) / 9
        );
        this.nextWeek[i].day = new Date(item.time * 1000);
      });
    },
    getWeather: function() {
      this.city = "";
      this.weather = "";
      this.temp = "";
      const $ = require("jquery");
      const axios = require("axios");
      const target = this.msg;
      if (target.trim().length === 0) return;

      const adderss = encodeURIComponent(target);

      // opencagedata.com
      const geoApiKey = "18a56beeb2e248a7a3b4d9817b61867f";
      const geoURL = `https://api.opencagedata.com/geocode/v1/json?q=${adderss}&key=${geoApiKey}`;

      // get location cordinates
      axios
        .get(geoURL)
        .then(response => {
          const location = {
            key: "0fdd6a96e9870fc5cff15ad176d3696e",
            lat: response.data.results[0].geometry.lat,
            lng: response.data.results[0].geometry.lng,
            url: "https://api.darksky.net/forecast/"
          };
          const req = `${location.url}${location.key}/${location.lat},${location.lng}`;
          this.city = response.data.results[0].formatted;
          return $.ajax({
            type: "GET",
            url: req,
            async: true,
            dataType: "jsonp",
            crossDomain: true,
            success: function(data, status, xhr) {}
          });
        })
        .then(response => {
          const temperature = response.currently.temperature;
          const summary = response.currently.summary;
          this.weather = `${summary}`;
          this.temp = `${Math.round(((temperature - 32) * 5) / 9)} C`;
          return response;
        })
        .then(response => {
          this.summaryImgView(response);
          this.weekForkast(response);
        })
        .catch(error => {
          const defaultMsg = "Invalid request to the server, try again laiter";
          if (!error) console.error(defaultMsg);
          else if (error.response && error.response.data) {
            console.error(error.response.data);
          } else if (error.message) {
            console.error(error.message);
          } else {
            console.error(defaultMsg);
          }
        });
    }
  },
  mounted: function() {
    setInterval(this.changeLogo, 5000);
  }
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

.container {
  width: 100%;
  min-width: 320px;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
}

body {
  min-height: 100vh;
  font-family: Tahoma, arial;
  color: #212121;
}

.topLine {
  background: #03a9f4;
  height: 100px;
  padding: 0 50px;
  box-sizing: border-box;
  margin: 0 0 50px 0;
  &__header {
    color: #ffeb3b;
    line-height: 100px;
  }
  &__logo {
    width: 80px;
    height: 80px;
    margin: auto 0;
  }
}

.weather {
  &__today {
    margin: auto;
  }
}

.today {
  width: 80%;
  border: 3px solid #0288d1;
  background: linear-gradient(#85d8ce, #085078);
  padding: 50px 30px;
  border-radius: 5px;
  &__header {
    font-size: 24px;
    text-transform: uppercase;
    font-weight: 100;
    margin: 0 0 30px 0;
  }
  &__form {
    background: #fff;
    display: inline-block;
    vertical-align: top;
    padding: 80px 30px;
    border: 1px solid #757575;
    color: #757575;
    border-radius: 5px;
    font-size: 20px;
  }
  &__inputBlock {
    margin: 10px 0 0 0;
    display: flex;
  }
  &__input {
    width: 200px;
    padding: 0 0 0 5px;
    border-radius: 5px 0 0 5px;
  }
  &__btn {
    height: 40px;
    width: 70px;
    display: inline-block;
    border-radius: 0 5px 5px 0;
    background: #0288d1;
    border: none;
    font-size: 20px;
    line-height: 40px;
  }
  &__outWrap {
    display: inline-block;
    vertical-align: top;
    margin: 0 0 0 50px;
    width: 55%;
  }
  &__out {
    display: flex;
    flex-wrap: wrap;
  }
  &__outField {
    width: 100%;
    height: 80px;
    line-height: 80px;
    display: flex;
    padding: 0 0 0 20px;
    border: 2px solid #0288d1;
    border-bottom: 0px solid #0288d1;
    &:last-child {
      border-bottom: 2px solid #0288d1;
    }
  }
  &__span {
    width: 90px;
    line-height: 80px;
    margin: 0 30px 0 0;
    color: #fff9c4;
    position: relative;
    z-index: 1;
  }
  &__outImg {
    position: relative;
    &:after {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      z-index: 0;
      display: block;
      background: rgba(0, 0, 0, 0.6);
    }
    &_city {
      background: url("./assets/img/city.jpg") center;
    }
    &_weather {
      background: url("./assets/img/weather.jpg") center;
    }
    &_temp {
      background: url("./assets/img/temp.jpg") center;
    }
  }
  &__output {
    position: relative;
    color: #ffeb3b;
    z-index: 1;
    font-size: 30px;
    overflow: hidden;
    overflow-y: auto;
  }
  &__outSummary {
    position: absolute;
    z-index: 1;
    height: 60px;
    right: 10px;
    top: 5px;
  }
}

.week {
  width: 100%;
  margin: 50px 0;
  &__list {
    list-style: none;
    display: flex;
  }
  &__day {
    border: 2px solid #0288d1;
    border-radius: 15px;
    padding: 20px 5px;
    width: calc(100% / 8);
    height: 300px;
    margin: 0 3px;
    background: linear-gradient(#85d8ce, #085078);
    text-align: center;
    line-height: 50px;
  }
  &__dayFormat {
    color: #fff9c4;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
    text-transform: uppercase;
    font-weight: bold;
  }
  &__minTemp {
    font-size: 40px;
    color: #1d3a4a;
    text-shadow: 1px 1px 1px black;
  }
  &__maxTemp {
    font-size: 40px;
    text-shadow: 1px 1px 1px black;
    color: #f34a12;
  }
  &__img {
    width: 80px;
    margin: 50px 0 0 0;
  }
}

/* Large Devices, Wide Screens */
@media only screen and (max-width: 1100px) {
  .today {
    width: 80%;
    padding: 20px 30px;
    border-radius: 5px;
    &__header {
      font-size: 24px;
      margin: 0 0 30px 0;
    }
    &__form {
      display: block;
      padding: 30px 50px;
      font-size: 20px;
    }
    &__inputBlock {
      margin: 10px 0 0 0;
      display: flex;
    }
    &__input {
      width: 200px;
    }
    &__outWrap {
      display: block;
      margin: 0px;
      width: 100%;
    }
    &__out {
      display: flex;
      flex-wrap: wrap;
    }
    &__outField {
      width: 100%;
      height: 80px;
      line-height: 80px;
    }
    &__span {
      margin: 0 30px 0 0;
    }
    &__output {
      font-size: 30px;
      overflow: hidden;
      overflow-y: auto;
    }
    &__outSummary {
      height: 60px;
      right: 10px;
      top: 5px;
    }
  }
}

/* Small Devices, Tablets */
@media only screen and (max-width: 935px) {
  .week {
    width: 90%;
    margin: 50px auto;
    &__list {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
    }
    &__day {
      border: 2px solid #0288d1;
      display: flex;
      padding: 5px 25px;
      width: 100%;
      height: 50px;
      margin: 5px 0;
      line-height: 50px;
      justify-content: space-between;
      align-items: center;
    }
    &__dayFormat {
      color: #fff9c4;
      text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
      text-transform: uppercase;
      font-weight: bold;
      width: 100px;
      text-align: left;
    }
    &__minTemp {
      font-size: 40px;
      color: #1d3a4a;
      text-shadow: 1px 1px 1px black;
    }
    &__maxTemp {
      font-size: 40px;
      text-shadow: 1px 1px 1px black;
      color: #f34a12;
    }
    &__img {
      width: 80px;
      height: 100%;
      margin: 0px;
    }
  }
}

/* Extra Small Devices, Phones */
@media only screen and (max-width: 730px) {
  .today {
    width: 90%;
    padding: 20px 15px;
    &__header {
      font-size: 18px;
      margin: 0 0 20px 0;
    }
    &__form {
      display: block;
      padding: 20px 30px;
      font-size: 20px;
    }
    &__inputBlock {
      margin: 10px 0 0 0;
      display: flex;
    }
    &__input {
      width: 200px;
    }
    &__outWrap {
      display: block;
      margin: 0 0 0 0px;
      width: 100%;
    }
    &__outField {
      width: 100%;
      height: 80px;
      line-height: 80px;
    }
    &__span {
      margin: 0 15px 0 0;
    }
    &__output {
      font-size: 22px;
      overflow: hidden;
      overflow-y: auto;
    }
    &__outSummary {
      height: 60px;
      right: 10px;
      top: 5px;
    }
  }
}

/* Extra Small Devices, Phones */
@media only screen and (max-width: 560px) {
  .topLine {
    background: #03a9f4;
    height: 60px;
    padding: 0 20px;
    box-sizing: border-box;
    margin: 0 0 30px 0;
    &__header {
      color: #ffeb3b;
      line-height: 60px;
      font-size: 20px;
    }
    &__logo {
      width: 50px;
      height: 50px;
      margin: auto 0;
    }
  }

  .today {
    width: 90%;
    padding: 10px 5px;
    &__header {
      font-size: 18px;
      margin: 0 0 20px 0;
    }
    &__form {
      padding: 20px 30px;
      font-size: 20px;
    }
    &__span {
      margin: 0 5px 0 0;
    }
    &__output {
      font-size: 14px;
      overflow: hidden;
      overflow-y: auto;
      &_temp {
        font-size: 35px;
      }
    }
    &__outSummary {
      height: 50px;
      right: 10px;
      top: 10px;
    }
  }
}

/* Custom, iPhone Retina */
@media only screen and (max-width: 450px) {
  .week {
    margin: 30px auto;
    &__day {
      padding: 5px 10px;
    }
    &__dayFormat {
      font-size: 14px;
      width: 100px;
    }
    &__minTemp {
      font-size: 30px;
      color: #1d3a4a;
      text-shadow: 1px 1px 1px black;
    }
    &__maxTemp {
      font-size: 30px;
      text-shadow: 1px 1px 1px black;
      color: #f34a12;
    }
    &__img {
      width: 60px;
      height: 100%;
      margin: 0px;
    }
  }
}

/*==========  Mobile First Method  ==========*/

/* Custom, iPhone Retina */
@media only screen and (min-width: 320px) {
}

/* Extra Small Devices, Phones */
@media only screen and (min-width: 480px) {
}

/* Small Devices, Tablets */
@media only screen and (min-width: 768px) {
}

/* Medium Devices, Desktops */
@media only screen and (min-width: 992px) {
}

/* Large Devices, Wide Screens */
@media only screen and (min-width: 1200px) {
}
</style>
