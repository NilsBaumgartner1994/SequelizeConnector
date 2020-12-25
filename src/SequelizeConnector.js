import {RequestHelper} from "./RequestHelper";
import {APIRequest} from "./APIRequest";
import MyStorage from "./MyStorage";

export class SequelizeConnector {

    static Callback_Logout = null;

    static schemes = null;
    static tableSchemes = {};
    static tableRoutes = {};
    static tableAssociations = {};

    constructor() {

    }

    static setStorageImplementation(storageImplementation){
        MyStorage.storageImplementation = storageImplementation;
    }

    static async handleLogout(){
        if(!!SequelizeConnector.Callback_Logout){
            await SequelizeConnector.Callback_Logout();
        }
    }

    static reset(){
        SequelizeConnector.schemes = null;
        SequelizeConnector.tableSchemes = {};
        SequelizeConnector.tableRoutes = {};
        SequelizeConnector.tableAssociations = {};
    }

    static async getSchemes(){
        if(!SequelizeConnector.schemes){
            let answer = await APIRequest.sendRequestWithAutoAuthorize(RequestHelper.REQUEST_TYPE_GET,"schemes");
            if(RequestHelper.isSuccess(answer)){
                SequelizeConnector.schemes = answer.data || {};
            }
        }
        return SequelizeConnector.schemes;
    }

    static async getScheme(tableName){
        let asyncFn = APIRequest.sendRequestWithAutoAuthorize.bind(null,RequestHelper.REQUEST_TYPE_GET, "schemes/" + tableName);
        return await SequelizeConnector.getVariableDownloadIt("tableSchemes",tableName,asyncFn);
    }

    static async getSchemeRoutes(tableName){
        console.log("getSchemeRoutes: "+tableName);
        let asyncFn = APIRequest.sendRequestWithAutoAuthorize.bind(null,RequestHelper.REQUEST_TYPE_GET,"schemes/"+tableName+"/routes");
        return await SequelizeConnector.getVariableDownloadIt("tableRoutes",tableName,asyncFn);
    }

    static async getSchemeAssociations(tableName){
        let asyncFn = APIRequest.sendRequestWithAutoAuthorize.bind(null,RequestHelper.REQUEST_TYPE_GET,"schemes/"+tableName+"/associations");
        return await SequelizeConnector.getVariableDownloadIt("tableAssociations",tableName,asyncFn);
    }

    static async getVariableDownloadIt(sequelizeConnectorSaveVariable,keyVariable,asyncFn){
        if(!SequelizeConnector[sequelizeConnectorSaveVariable][keyVariable]){
            let answer = await asyncFn();
            if(RequestHelper.isSuccess(answer)){
                SequelizeConnector[sequelizeConnectorSaveVariable][keyVariable] = answer.data;
            }
        }
        return SequelizeConnector[sequelizeConnectorSaveVariable][keyVariable];
    }


}

export default SequelizeConnector;