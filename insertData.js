const mongoose = require("mongoose");
const axios = require("axios");
const Country = require("./models/Country");
const State = require("./models/State");
const User = require("./models/User");
const City = require("./models/City");
const databaseName = "AssessmentDatabaseCheck";

const dbURI = `mongodb://localhost/${databaseName}`;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJhaHNhbi5zaWRkaXFAYXN0ZXJhLmNvbSIsImFwaV90b2tlbiI6IjFIM21sZWpiTjZPdk1WVERmWU55YjZpc2NuYnllWm0yM2w0cFBtQVktQWM1ekZJb3Q2RW96Q1pLamZwNm5nQjVjMFEifSwiZXhwIjoxNjk3MzkyODY5fQ.k0dmc1TvAlUhOOl-7gPamPiDirxMbubTYTm-EwjLbj8";
const insertCountries = (countryInsertedData) => {
  const findCountries = countryInsertedData.filter((country) => {
    return countryArray.includes(country.name);
  });
};
const fetchCountryDatafromAPI = async () => {
  const countryListResponse = await axios.get(
    "https://www.universal-tutorial.com/api/countries",
    { headers: { Authorization: "Bearer " + token } }
  );
  return countryListResponse.data;
};

const fetchStateDatafromAPI = async (country) => {
  try {
    const stateListResponse = await axios.get(
      `https://www.universal-tutorial.com/api/states/${country.name}`,
      { headers: { Authorization: "Bearer " + token } }
    );
    const stateUpdatedList = stateListResponse.data.map((state) => {
      return { name: state.state_name, country: country._id };
    });
    const stateInsertedData = await State.insertMany(stateUpdatedList);
    stateInsertedData.map((state) => {
      fetchCityDatafromAPI(state, country);
    });
  } catch (err) {
    // console.log(err);
  }
};
const fetchCityDatafromAPI = async (state, country) => {
  try {
    const cityListResponse = await axios.get(
      `https://www.universal-tutorial.com/api/cities/${state.name}`,
      { headers: { Authorization: "Bearer " + token } }
    );
    const cityUpdatedList = cityListResponse.data.map((city) => {
      return { name: city.city_name, state: state._id, country: country._id };
    });
    console.log(cityUpdatedList)
    await City.insertMany(cityUpdatedList);
  } catch (err) {
    // console.log(err);
  }
};
const insertData = async () => {
  try {
    const data = await fetchCountryDatafromAPI();
    const countryList = data.map((country) => {
      return { name: country.country_name };
    });
    await User.deleteMany({});
    await Country.deleteMany({});
    await State.deleteMany({});
    await City.deleteMany({});
    const countryInsertedData = await Country.insertMany(countryList);

    countryInsertedData.map((country) => {
      fetchStateDatafromAPI(country);
    });

    insertCountries(countryInsertedData);

    console.log("Operation done")
  } catch (err) {
    // console.log(err);
  }
};

insertData();
