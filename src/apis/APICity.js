import APIHandler from "./APIHandler.js";

class APICity extends APIHandler {
  async queryCitiesByIdCountry(_idCountry, _idAvoidCity) {
    try {
      const data = await this.getRequest(
        "http://localhost:8090/dp1/api/city/findby/country?idcountry=" +
          _idCountry +
          "&avoidcity=" +
          _idAvoidCity
      );
      return data;
    } catch (error) {
      console.error(error);
    }
  }
}

export default APICity;
