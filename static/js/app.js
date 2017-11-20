//API being used to grab meta data about crypto currencies (mostly logo images)
let CRYPOCOMPARE_API_URI = "https://min-api.cryptocompare.com";

//This is the url used to get the images
let = CRYPTOCOMPARE_IMAGE_API_URI = "https://www.cryptocompare.com";

//API being used to grabbing crypto currency prices
let COINMARKETCAP_API_URI = "https://api.coinmarketcap.com";

//rate at which the chart is updated
let UPDATE_INTERVAL = 60 * 1000;

let app = new Vue({
  el: "#app",
  data: {
    coins: [],
    coinData: {},
    highestDailyChange: {},
    highestWeeklyChange: {}
  },

  methods: {

    //Loads all cryptocurrency data, used to grab logos
    getCoinData: function() {
      let self = this;

      axios.get(CRYPOCOMPARE_API_URI + "/data/all/coinlist")
        .then((resp) => {
          this.coinData = resp.data.Data;
          this.getCoins();
        })
        .catch((err) => {
          this.getCoins();
          console.log('Error');
          console.error(err);
        });
    },

    getMaxOfArray: function(numArray) {
      let max1DayChange = Math.max.apply(Math,numArray.map(function(o){return o.percent_change_24h;}));
      this.highestDailyChange = numArray.find(function(o){ return o.percent_change_24h == max1DayChange; })

      let max7dayChange = Math.max.apply(Math,numArray.map(function(o){return o.percent_change_7d;}));
      this.highestWeeklyChange = numArray.find(function(o){ return o.percent_change_7d == max7dayChange; })

    },

    //Gets all cryptocurrencys by value, data refreshed every 5 minutes but back end API service
    getCoins: function() {
      let self = this;

      axios.get(COINMARKETCAP_API_URI + "/v1/ticker/?convert=GBP&limit=10")
        .then((resp) => {
          this.coins = resp.data;
          this.getMaxOfArray(this.coins)
        })
        .catch((err) => {
          console.error(err);
        });
    },

    getCoinImage: function(symbol) {
      symbol = (symbol === "MIOTA" ? "IOT" : symbol);
      symbol = (symbol === "VERI" ? "VRM" : symbol);
      return CRYPTOCOMPARE_IMAGE_API_URI + this.coinData[symbol].ImageUrl;
    },

    getColor: (num) => {
      return num > 0 ? "color:green;" : "color:red;";
    },

  },

  created: function() {
    this.getCoinData();
  },

});

setInterval(() => {
  app.getCoins();
}, UPDATE_INTERVAL);
