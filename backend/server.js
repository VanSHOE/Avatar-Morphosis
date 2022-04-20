import express from "express";
const app = express();
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
const PORT = process.env.PORT || 4000;
// const expressfileupload = require("express-fileupload");
import auth from "./middleware/auth.js";
import fs from "fs";
import http from "http";
import https from "https";
var privateKey = fs.readFileSync("/root/key.txt", "utf8");
var certificate = fs.readFileSync("/root/mernvendorbuyer_me_chain.crt", "utf8");
import UserRouter from "./routes/Users.js";
import UploadRouter from "./routes/Upload.js";
//app.use(cors());
var credentials = { key: privateKey, cert: certificate };
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(expressfileupload());

// Connection to MongoDB
mongoose.connect(
  "mongodb+srv://root:toor@avatar.2c24z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully !");
});

// setup API endpoints

app.use("/user", UserRouter);
app.use("/upload", UploadRouter);
app.use("/uploads", express.static("uploads"));
app.use(function (req, res, next) {
  res.setTimeout(0);
  next();
});
// app.listen(PORT, function () {
//   console.log("Server is running on Port: " + PORT);
// });
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(4000);
