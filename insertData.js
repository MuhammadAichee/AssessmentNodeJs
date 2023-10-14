const mongoose = require("mongoose");
const axios = require("axios");
const Country = require("./models/Country");
const databaseName = "AssessmentDatabase";

const dbURI = `mongodb://localhost/${databaseName}`;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

const fetchDatafromAPIs = async () => {
  const countryListResponse = await axios.get("https://restcountries.com/v3.1/all");
  return countryListResponse.data;
};
const insertData = async () => {
  try {
    const data = await fetchDatafromAPIs();
    const countryList = data.map((country) => {
      return ({ name: country.name.common });
    });
    const countryInsertedData = await Country.insertMany(countryList);
    
  } catch (err) {
    console.log(err);
  }
};

insertData();
