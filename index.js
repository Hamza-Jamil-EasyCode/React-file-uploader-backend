const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();

const port = process.env.PORT;
const host = process.env.HOST;
const app = express();

app.use(cors());
app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/uploads", express.static("uploads"));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },

  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + file.originalname);
  },
});

const upload = multer({ storage: fileStorage });

app.get("/", (req, res) => {
  res.send("Backend working!");
});

app.post("/upload-video", upload.single("file"), (req, res) => {
  console.log(req.file);

  const url = `${host}:${port}/${req.file.path}`;

  res.json({ url, message: "File uploaded successfully" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
