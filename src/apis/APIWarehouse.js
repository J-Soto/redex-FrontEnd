/** @format */

import APIHandler from "./APIHandler.js";

class APIWarehouse extends APIHandler {
	async queryWarehouseByIdAirport(_idAirport) {
		try {
			const data = await this.getRequest(
				"http://localhost:8090/dp1/api/warehouse/findby/city/airport?id=" +
					_idAirport
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}

	async queryAllWarehouse() {
		try {
			const data = await this.getRequest(
				"http://localhost:8090/dp1/api/warehouse/all"
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}

	async editCapacity(_idWarehouse, _capacity) {
		try {
			const data = await this.postRequest2(
				"http://localhost:8090/dp1/api/warehouse/update/capacity?id=" +
					_idWarehouse +
					"&capacity=" +
					_capacity
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}
	async getInfoWarehouse(_idWarehouse) {
		try {
			const data = await this.getRequest(
				"http://localhost:8090/dp1/api/warehouse/info?id=" + _idWarehouse
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}
}

export default APIWarehouse;
