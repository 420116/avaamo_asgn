const axios = require("axios");
const fs = require("fs");
let URL =
  "https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20210216T114936Z.e4989dccd61b9626.373cddfbfb8a3b2ff30a03392b4e0b076f14cff9&lang=en-en&text=";

const prepareCalls = async (results) => {
  let promises = results.map((word) => {
    return callDictionary(word);
  });
  return await Promise.allSettled(promises);
};

const formatWords = (str) => {
  //console.log(string);
  try {
    let formattedStr = str.replace(
      /[.,-/#!$%^&*;:<>+@{}=\-_`~()\n""0-9']/g,
      ""
    );
    let uniqueValues = new Set(formattedStr.split(" "));
    uniqueValues = [...uniqueValues.values()].sort();
    let results = [];
    uniqueValues.forEach((items) => {
      if (results.length < 30) {
        if (items.length > 2 && !Number(items)) {
          results.push(items);
        }
      } else {
        return results;
      }
    });
    return results;
  } catch (error) {}
};

const callDictionary = async (key) => {
  let data = await axios(
    "https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20210216T114936Z.e4989dccd61b9626.373cddfbfb8a3b2ff30a03392b4e0b076f14cff9&lang=en-en&text=" +
      key
  );
  return data;
};

const getWords = (req, res, next) => {
  getTexts()
    .then(function (response) {
      console.log(response);
      res.send(formatResponse(response));
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      res.json("error");
    });
};

const formatResponse = (aResponse) => {
  let validRes = aResponse.filter((item) => item.value.data.def.length > 0);
  let output = validRes.reduce((html, item) => {
    let syno = "";
    if (item.value.data.def[0].tr.length > 0) {
      syno = item.value.data.def[0].tr.reduce((a, b) => {
        return b.text + ", " + a;
      }, "");
    }
    return (
      html +
      `<div><h1>${item.value.data.def[0].text}</h1><div><h2>Synonyms-</h2>${syno}</div></div>`
    );
  }, "");

  return `<div style="background: #d092da;padding: 2rem;;border-radius: 20px;">${output}</div>`;
};

const getTexts = async () => {
  const response = await axios.get("http://norvig.com/big.txt", {
    headers: { "Content-Type": "application/json" },
  });

  let string = "";
  string = response.data;
  const texts = formatWords(string);
  return await prepareCalls(texts);
};

exports.getWords = getWords;
