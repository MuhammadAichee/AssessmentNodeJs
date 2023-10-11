const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
const port = 8000;

const url = "mongodb://localhost:27017";
const databaseName = "AssessmentDatabase";

const client = new MongoClient(url, { useUnifiedTopology: true });
const user = require("./models/User");
const country = require("./models/Country");
const city = require("./models/City");
const state = require("./models/State");
const startApp = async () => {
  try {
    await client.connect();
    const db = client.db(databaseName);
    console.log(`Connected to the "${databaseName}" database`);
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
    app.use(user);
    app.use(country);
    app.use(city);
    app.use(state);
    
  } catch (err) {
    console.error(err);
  }
};

startApp();
