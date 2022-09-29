const fetch = require("node-fetch");

class APIHandler {
  async postRequest(url, data) {
    
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      mode: "no-cors",
      headers: new fetch.Headers({
        "Content-Type": "application/json",
      }),
    });
    return await response.json();
  }

  async postRequest2(url) {
        
    const response = await fetch(url, {
      method: "POST",
      //body: JSON.stringify(data),
      mode: "no-cors",
      /*headers: new fetch.Headers({
        "Content-Type": "application/json",
      }),*/
    });
    return await response.json();
    
  }

  async getRequest(url) {
    const response = await fetch(url, {
      method: "GET",
      mode: "no-cors",
    });
    return await response.json();
  }
}

export default APIHandler;
