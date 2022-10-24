/** @format */

import APIHandler from "./APIHandler.js";

class APIShipment extends APIHandler {
	async findShipmentByTrackingCode(_trackingCode) {
		try {
			const data = await this.getRequest(
				"http://54.163.93.146:8090/dp1/api/dispatch/tracking?code=" + _trackingCode
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}
	async listShipments(_id) {
		try {
			const data = await this.getRequest(
				"http://54.163.93.146:8090/dp1/api/dispatch/findby/oairport?code=" + _id
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}

	async listShipmentsIn(_id) {
		try {
			const data = await this.getRequest(
				"http://54.163.93.146:8090/dp1/api/dispatch/findby/dairport?code=" + _id
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}
	async listShipmentsAll() {
		try {
			const data = await this.getRequest(
				"http://54.163.93.146:8090/dp1/api/dispatch/all"
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}

	async saveShipment(
		_status,
		_late,
		_send_client,
		_receive_client_document,
		_receive_client_name,
		_receive_client_lastname,
		_originAirport,
		_pack
	) {
		try {
			const data = await this.postRequest(
				"http://54.163.93.146:8090/dp1/api/dispatch/save",
				{
					status: _status,
					late: _late,
					send_client: _send_client,
					receiveClientLastname: _receive_client_lastname,
					receiveClientName: _receive_client_name,
					receiveClientDocument: _receive_client_document,
					originAirport: _originAirport,
					pack: _pack,
				}
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}

	async finishShipmentNow(_status, _trackingCode) {
		try {
			const data = await this.postRequest(
				"http://54.163.93.146:8090/dp1/api/dispatch/update/status",
				{ tracking: _trackingCode, status: _status }
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}

	async uploadZip(_file) {
		try {
			const data = await this.postRequest2(
				"http://54.163.93.146:8090/dp1/api/dispatch/upload/zip",
				_file
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}
}
export default APIShipment;
