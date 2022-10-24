/** @format */

import APIHandler from "./APIHandler.js";

class APIPackage extends APIHandler {
	async queryAllPackages() {
		try {
			const data = await this.getRequest(
				"http://54.163.93.146:8090/dp1/api/package/all"
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}

	async queryAllPackagesOutgoing(_idWarehouse) {
		try {
			const data = await this.getRequest(
				"http://54.163.93.146:8090/dp1/api/dispatch/outgoing?id=" + _idWarehouse
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}
	async queryAllPackagesIngoing(_idWarehouse) {
		try {
			const data = await this.getRequest(
				"http://54.163.93.146:8090/dp1/api/dispatch/arriving?id=" + _idWarehouse
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}
}

export default APIPackage;
