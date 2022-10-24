/** @format */

import APIHandler from "./APIHandler.js";

class APIIncident extends APIHandler {
	async getDashboards(_simulated) {
		try {
			const data = await this.getRequest(
				"http://54.163.93.146:8090/dp1/api/incident/dashboards?simulated=" +
					_simulated
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}
	async getDataAirports(_simulated) {
		try {
			const data = await this.getRequest(
				"http://54.163.93.146:8090/dp1/api/incident/airports?simulated=" +
					_simulated
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}
	async getDataFlights(_simulated) {
		try {
			const data = await this.getRequest(
				"http://54.163.93.146:8090/dp1/api/incident/flightplans?simulated=" +
					_simulated
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}
}

export default APIIncident;
