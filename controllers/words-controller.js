const axios = require("axios");
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
  let data = await axios(URL + key);
  return data;
};

const getWords = (req, res, next) => {
  getTexts()
    .then(function (response) {
      res.send(formatResponse(response));
    })
    .catch(function (error) {
      res.json("error");
    });
};

const formatResponse = (aResponse) => {
  let validRes = aResponse.filter((item) => item.value.data.def.length > 0);
  let output = validRes.reduce((html, item) => {
    let syno = "";
    let wordList = item.value.data.def[0];
    if (wordList.tr.length > 0) {
      syno = wordList.tr.reduce((a, b) => {
        return b.text + ", " + a;
      }, "");
    }
    return (
      `<div><h1>${wordList.text}</h1><div style="display:flex;align-items:center;"><h4>Synonyms- </h4>${syno}</div><div style="display:flex;align-items:center;"><h4>Part of Speech - </h4>${wordList.pos}</div></div>` +
      html
    );
  }, "");

  return `<body style="background: black;padding: 4rem;"><div style="background: #d092da;padding: 2rem;;border-radius: 20px;">${output}</div></body>`;
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
