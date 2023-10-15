const mongoose = require('mongoose');
const express = require("express");
const cors = require('cors');
const app = express();
const port = 8000;
const databaseName = "AssessmentDatabaseCheck";
const userRouter = require("./controllers/userController");
const cityRouter = require('./controllers/cityController');
const countryRouter = require('./controllers/countryController');
const stateRouter = require('./controllers/stateController');

const startApp = async () => {
  try {
    const dbURI = `mongodb://localhost/${databaseName}`;

    mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('connected', () => {
      console.log(`Connected to the database: ${dbURI}`);
    });
    app.use(cors());
    app.use(express.json())
    app.use('/api/users', userRouter);
    app.use('/api/city', cityRouter);
    app.use('/api/state', stateRouter);
    app.use('/api/country', countryRouter);
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

  } catch (err) {
    console.error(err);
  }
};

startApp();
