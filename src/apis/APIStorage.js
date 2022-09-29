/** @format */

import APIHandler from "./APIHandler.js";

class APIStorage extends APIHandler {
	async deleteSimulation() {
		try {
			const data = await this.getRequest(
				"http://localhost:8090/dp1/api/storage/deleteSimulated"
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}

	async updateCheckOut(_idPackage, _idWarehouse) {
		try {
			const data = await this.postRequest2(
				"http://localhost:8090/dp1/api/storage/update/checkout?idPack=" +
					_idPackage +
					"&idWarehouse=" +
					_idWarehouse
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}
	async updateCheckIn(_idPackage, _idWarehouse) {
		try {
			const data = await this.postRequest2(
				"http://localhost:8090/dp1/api/storage/update/checkin?idPack=" +
					_idPackage +
					"&idWarehouse=" +
					_idWarehouse
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}
}
export default APIStorage;
