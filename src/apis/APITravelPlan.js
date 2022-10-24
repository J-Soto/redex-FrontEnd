/** @format */

import APIHandler from "./APIHandler.js";

class APITravelPlan extends APIHandler {
	async generateRoute(_idStart, _idDest) {
		try {
			const data = await this.getRequest(
				"http://54.163.93.146:8090/dp1/api/airport/flight/route/generateRoute?idStart=" +
					_idStart +
					"&idObjective=" +
					_idDest
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}
}
export default APITravelPlan;
