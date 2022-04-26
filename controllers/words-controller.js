const axios = require("axios");
const fs = require("fs");
const getWords = (req, res, next) => {
  axios
    .get("http://norvig.com/big.txt", {
      headers: { "Content-Type": "application/json" },
    })
    .then(function (response, body) {
      // handle success
      //res.json(response);
      let string = "";
      string = response.data;
      res.json(formatWords(string));
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
};

const formatWords = (str) => {
  let formattedStr = str.replace(/[.,-/#!$%^&*;:{}=\-_`~()\n""]/g, "");
  let uniqueValues = new Set(formattedStr.split(" "));
  uniqueValues = [...uniqueValues.values()].sort();
  let results = [];
  uniqueValues.forEach((items) => {
    if (results.length > 10) {
      return;
    }
    if (items.length > 2) {
      results.push(items);
    }
  });
  console.log(results);
  return JSON.stringify(uniqueValues);
};

exports.getWords = getWords;

//https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20210216T114936Z.e4989dccd61b9626.373cddfbfb8a3b2ff30a03392b4e0b076f14cff9&lang=en-en&text=time
