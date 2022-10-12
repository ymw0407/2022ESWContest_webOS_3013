const router = require("./Router.js");
const bodyParser = require("body-parser");
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

const PORT = 8000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "resource/",
  })
);

app.use("/", router);

app.listen(PORT, () => {
  console.log(`running media server on ${PORT}`);
});
