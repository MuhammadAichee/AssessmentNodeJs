const mongoose = require("mongoose");
const axios = require("axios");
const Country = require("./models/Country");
const State = require("./models/State");
const User = require("./models/User");
const City = require("./models/City");
const databaseName = "AssessmentDatabaseCheck4";

const dbURI = `mongodb://localhost/${databaseName}`;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
let token =
"NWVmR1VucXEyQkVybHZjelBYRU44eWx1UHJxYkY2VjNMOUZEZFdiSw=="
  
const fetchCountryDatafromAPI = async () => {
  const countryListResponse = await axios.get(
    "https://api.countrystatecity.in/v1/countries",
    { headers: { "X-CSCAPI-KEY": token } }
  );
  return countryListResponse.data;
};

const fetchStateDatafromAPI = async (country) => {
  try {
    const stateListResponse = await axios.get(
      `https://api.countrystatecity.in/v1/countries/${country.code}/states`,
      { headers: { "X-CSCAPI-KEY": token } }
    );
    const stateUpdatedList = stateListResponse.data.map((state) => {
      return { name: state.name, code : state.iso2, country: country._id };
    });
    const stateInsertedData = await State.insertMany(stateUpdatedList);

    stateInsertedData.map(async (state) => {
      await fetchCityDatafromAPI(state, country);
    });
  } catch (err) {
    console.log(err)
  }
};
const fetchCityDatafromAPI = async (state, country) => {
  try {
    const cityListResponse = await axios.get(
      `https://api.countrystatecity.in/v1/countries/${country.code}/states/${state.code}/cities`,
      { headers: { "X-CSCAPI-KEY": token } }
    );
    const cityUpdatedList = cityListResponse.data.map((city) => {
      return { name: city.name, state: state._id, country: country._id };
    });
    console.log(cityUpdatedList)
    await City.insertMany(cityUpdatedList);
  } catch (err) {
    
  }
};
const insertData = async () => {
  try {
    const data = await fetchCountryDatafromAPI();
    const countryList = data.map((country) => {
      return { name: country.name, code : country.iso2 };
    });
    await User.deleteMany({});
    await Country.deleteMany({});
    await State.deleteMany({});
    await City.deleteMany({});
    const countryInsertedData = await Country.insertMany(countryList);

    countryInsertedData.map(async (country) => {
      await fetchStateDatafromAPI(country);
    });
  } catch (err) {
    console.log(err);
  }
};

insertData();
