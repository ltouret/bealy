//-----------------
// RequestService.ts
import axios from 'axios';

// "Referrer-Policy": (process.env.REACT_APP_REST_MODE !== 'development') ? "strict-origin-when-cross-origin" : "none",
//"Access-Control-Allow-Credentials": false
const headers = { 'Content-Type': 'application/json'};

/*
const opts = {
    withCredentials: process.env.REACT_APP_REST_MODE === 'development' ? false : true, //true,
    headers: headers
};
*/

const opts = {
    withCredentials: false, //true,
    headers: headers
};

class RequestService {
    getRequest(url : string) : Promise<any> {
         return axios.get(url, opts);
    };

    // a tester
    postRequest(url : string, data : any) : Promise<any> {
        return axios.post(url, data, opts)
    };

    putRequest(url : string, data : any) {
        return axios.put(url, data, opts)
    };

    patchRequest(url : string, data : any) {
        return axios.patch(url, data, opts)
    };

    deleteRequest(url : string) {
        return axios.delete(url, opts);
    };
};

export default new RequestService();  