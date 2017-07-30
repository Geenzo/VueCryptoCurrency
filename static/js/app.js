//API being used to grab meta data about crypto currencies (mostly logo images)
let CRYPOCOMPARE_API_URI = "https://www.cryptocompare.com";

//API being used to grabbing crypto currency prices
let COINMARKETCAP_API_URI = "https://api.coinmarketcap.com";

//rate at which the chart is updated
let UPDATE_INTERVAL = 60 * 1000;

let app = new Vue({
  el: "#app",
  data: {
    coins: [],
    coinData: {}
  },

  methods: {

    //Loads all cryptocurrency data, used to grab logos
    getCoinData: function() {
      let self = this;
      console.log("In get coin data");

      axios.get(CRYPOCOMPARE_API_URI + "/api/data/coinlist")
        .then((resp) => {
          this.coinData = resp.data.Data;
          this.getCoins();
          console.log('in getCoinData get');
          console.log(this.coinData);
        })
        .catch((resp) => {
          this.getCoins();
          console.log('Error');
          console.error(err);
        });
    },

    //Gets all cryptocurrencys by value, data refreshed every 5 minutes but back end API service
    getCoins: function() {
      let self = this;
      console.log('In get coins');

      axios.get(COINMARKETCAP_API_URI + "/v1/ticker/?limit=8")
        .then((resp) => {
          this.coins = resp.data;
          console.log('In get coins GET');
          console.log(this.coinData);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    getCoinImage: function(symbol) {
      console.log(CRYPOCOMPARE_API_URI + this.coinData[symbol].ImageUrl);
      return CRYPOCOMPARE_API_URI + this.coinData[symbol].ImageUrl;
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
