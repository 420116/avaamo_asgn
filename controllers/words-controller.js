const axios = require("axios");
const fs = require("fs");
const getWords = (req, res, next) => {
  axios
    .get("http://norvig.com/big.txt", {
      headers: { "Content-Type": "application/json" },
    })
    .then(function (response) {
      // handle success
      //res.json(response);
      res.end(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
};

exports.getWords = getWords;
