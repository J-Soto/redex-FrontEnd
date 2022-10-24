import APIHandler from "./APIHandler.js";

class APICity extends APIHandler {
  async queryCitiesByIdCountry(_idCountry, _idAvoidCity) {
    try {
      const data = await this.getRequest(
        "http://54.163.93.146:8090/dp1/api/city/findby/country?idcountry=" +
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
