import APIHandler from "./APIHandler.js";

class APIUser extends APIHandler {
  async login(_username, _password) {
    try {
      const data = await this.getRequest(
        "http://localhost:8090/dp1//api/user/logueo?username=" +
          _username +
          "&password=" +
          _password
      );
      return data;
    } catch (error) {
      console.error(error);
    }
  }
}

export default APIUser;
