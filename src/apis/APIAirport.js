/** @format */

import APIHandler from "./APIHandler.js";

class APIAirport extends APIHandler {
	async queryAirportByIdCity(_idCity) {
		try {
			const data = await this.getRequest(
				"http://localhost:8090/dp1/api/airport/findby/city?id=" + _idCity
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}

	async queryAllAirports() {
		try {
			const data = await this.getRequest(
				"http://localhost:8090/dp1/api/airport/all"
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}

	async queryAllFlights() {
		try {
			const data = await this.getRequest(
				"http://localhost:8090/dp1/api/airport/flight/all"
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}
	async editCapacity(_idFlight, _capacity) {
		try {
			const data = await this.postRequest2(
				"http://localhost:8090/dp1/api/airport/flight/update/capacity?id=" +
					_idFlight +
					"&capacity=" +
					_capacity
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}

	async findFlightById(_idFlight) {
		try {
			const data = await this.getRequest(
				"http://localhost:8090/dp1/api/airport/flight/find?id=" + _idFlight
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}
}

export default APIAirport;
