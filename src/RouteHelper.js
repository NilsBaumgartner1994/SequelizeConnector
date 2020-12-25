import {SchemeHelper} from "./SchemeHelper";
import {SequelizeConnector} from "./SequelizeConnector";

export class RouteHelper{

	static getInstanceRoute(schemes, tableName){
		let getRoute = schemes[tableName]["GET"];
		getRoute = getRoute.replace("/api","");
		return getRoute;
	}

	static getInstanceRouteForParams(schemes, tableName, params){
		let getRoute = schemes[tableName]["GET"];
		getRoute = getRoute.replace("/api/","");
		let paramKeys = Object.keys(params);
		for(let i=0;i<paramKeys.length; i++){
			let paramKey = paramKeys[i];
			getRoute = getRoute.replace(":"+paramKey,params[paramKey]);
		}
		return getRoute;
	}

	static getInstanceRouteForResource(schemes,modelscheme,tableName,resource){
		let primaryKeyFields = SchemeHelper.getPrimaryAttributeKeys(modelscheme);
		let getRoute = schemes[tableName]["GET"];
		getRoute = getRoute.replace("/api/","");
		for(let i=0; i<primaryKeyFields.length; i++){
			let primaryKeyField = primaryKeyFields[i];
			let value = resource[primaryKeyField];
			getRoute = getRoute.replace(":"+tableName+"_"+primaryKeyField,value)
		}
		return getRoute;
	}

	static async getIndexRouteForResourceAsync(tableName){
		let schemes = await SequelizeConnector.getSchemes();
		return RouteHelper.getIndexRouteForResource(schemes,tableName);
	}

	static getIndexRouteForResource(schemes, tableName){
		let getRoute = schemes[tableName]["INDEX"];
		getRoute = getRoute.replace("/api/","");
		return getRoute;
	}

	static getCreateRouteForResource(schemes, tableName){
		let getRoute = RouteHelper.getIndexRouteForResource(schemes,tableName);
		getRoute = "/create/"+getRoute;
		return getRoute;
	}

	static getIndexRouteForAssociation(schemes,resourceModelScheme,resourceTablename, resource, associationName){
		let resourceInstanceRoute = RouteHelper.getInstanceRouteForResource(schemes, resourceModelScheme,resourceTablename,resource);
		let associationIndexRoute = resourceInstanceRoute+"/associations/"+associationName;
		return associationIndexRoute;
	}

	static getInstanceRouteForAssociatedResource(schemes,resourceModelScheme,resourceTablename, resource, associationModelScheme, associationTableName,associationName, associationResource){
		let associationIndexRoute = RouteHelper.getIndexRouteForAssociation(schemes,resourceModelScheme,resourceTablename, resource, associationName);
		let associationInstanceRoute = RouteHelper.getInstanceRouteForResource(schemes,associationModelScheme,associationTableName,associationResource);
		let primaryKeyParamsRoute = associationInstanceRoute.replace("models/"+associationTableName+"/","");
		let associationRoute = associationIndexRoute+"/"+primaryKeyParamsRoute;
		return associationRoute;
	}

}

export default RouteHelper;