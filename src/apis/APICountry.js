/** @format */

import APIHandler from "./APIHandler.js";

class APICountry extends APIHandler {
	async queryAllCountries() {
		try {
			const data = await this.getRequest(
				"http://54.163.93.146:8090/dp1/api/country/all"
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}
}
export default APICountry;
