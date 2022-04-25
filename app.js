const express = require("express");
const bodyParser = require("body-parser");
const wordsRoutes = require("./routes/words-routes");

const app = express();

app.use(bodyParser.json());

app.use("/api/routes/", wordsRoutes);

app.listen(3000);
