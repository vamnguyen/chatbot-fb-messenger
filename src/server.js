// require("dotenv").config();
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import express from "express";
import viewEngine from "./configs/viewEngine.js";
import initWebRoutes from "./routes/web.js";

// Init app
let app = express();

// Config middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// config view Engine
viewEngine(app);

// config web routes
initWebRoutes(app);

let port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App is running at the port: ${port}`);
});
