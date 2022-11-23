/** @format */

import APIHandler from "./APIHandler.js";

class APICountry extends APIHandler {
	async queryAllCountries() {
		try {
			const data = await this.getRequest(
				"http://localhost:8090/dp1/api/country/all"
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}
}
export default APICountry;
