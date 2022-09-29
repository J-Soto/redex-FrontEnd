/** @format */

import APIHandler from "./APIHandler.js";

class APIClient extends APIHandler {
	async findClientByDocument(_document) {
		try {
			const data = await this.getRequest(
				"http://localhost:8090/dp1/api/client/findby/document?document=" +
					_document
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}
	async editClient(
		_idC,
		_documentC,
		_nameC,
		_lastnameC,
		_emailC,
		_cellphoneC,
		_registerDate
	) {
		try {
			const data = await this.postRequest(
				"http://localhost:8090/dp1/api/client/edit",
				{
					id: _idC,
					document: _documentC,
					name: _nameC,
					lastname: _lastnameC,
					email: _emailC,
					cellphone: _cellphoneC,
					registerDate: _registerDate,
				}
			);
			return data;
		} catch (error) {
			console.error(error);
		}
	}
}

export default APIClient;
