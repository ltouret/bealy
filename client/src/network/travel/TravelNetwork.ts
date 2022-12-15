import RequestService from '../RequestService';

/*
import {REACT_APP_REST_BACK} from '@networkAdapter/envpass';
const BASE_URL = `${REACT_APP_REST_BACK}/api`
*/

 const BASE_URL_ALIVE = "http://localhost:8080";
 const BASE_URL_TRAVEL = "http://localhost:8080/travel";
 class ApiUserService {

    /* ******* || GET methods || ******* */
    
    getServerAlive() : Promise<any> {
        let url = `${BASE_URL_ALIVE}/alive`;
        return RequestService.getRequest(url);
    };

    getServerTravelAlive() : Promise<any> {
        let url = `${BASE_URL_ALIVE}/users/me`;
        return RequestService.getRequest(url);
    };
}; 

export default new ApiUserService();