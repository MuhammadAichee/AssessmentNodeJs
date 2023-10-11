const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
const port = 8000;

const url = "mongodb://localhost:27017";
const databaseName = "AssessmentDatabase";

const client = new MongoClient(url, { useUnifiedTopology: true });

const startApp = async () => {
  try {
    await client.connect();
    const db = client.db(databaseName);
    console.log(`Connected to the "${databaseName}" database`);
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
  }
};

startApp();
