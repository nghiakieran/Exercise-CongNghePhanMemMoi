import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import connectDB from "./config/configdb";

const app = express();

// Config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

configViewEngine(app);
initWebRoutes(app);
connectDB();

const port = process.env.PORT || 6969;

// Run server
app.listen(port, () => {
  console.log(`✓ Backend Nodejs is running on the port: ${port}`);
});
