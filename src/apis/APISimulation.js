/** @format */

import APIHandler from "./APIHandler.js";

class APISimulation extends APIHandler {
	async getTimeline(_date, _time, _simulate) {
		try {
			const data = await this.getRequest(
				"http://localhost:8090/dp1/api/warehouse/timeline?date=" +
					_date +
					"&time=" +
					_time +
					"&simulated=" +
					_simulate
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}

	async getInformationAirport(_id, _dateStart, _dateEnd, _simulate) {
		try {
			const data = await this.getRequest(
				"http://localhost:8090/dp1/api/warehouse/fails/range?id=" +
					_id +
					"&idate=" +
					_dateStart +
					"&fdate=" +
					_dateEnd +
					"&simulated=" +
					_simulate
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}
}

export default APISimulation;
