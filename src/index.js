const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

console.log(path.join(__dirname, "public"));

app.use("/static", express.static(path.join(__dirname, "..", "public")));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
