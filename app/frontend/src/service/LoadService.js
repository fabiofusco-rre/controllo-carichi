import { getPathWithParams } from "../helpers/util";
import { LOAD_CONFIGS, DEVICE_MANAGER, PRIORITY, SWITCH_DOWN } from "../constant/endpoint"
import { get, patch, post, put } from "./common/webService";


export const getConfigs = async () => {
  try {
    const response = await get(LOAD_CONFIGS);
    return responseHandler(response);
  } catch (error) {
    throw _handleError(error);
  }
}

export const postPriority = async (payload) => {
  try {
    const response = await post(PRIORITY, payload);
    return responseHandler(response);
  } catch (error) {
    throw _handleError(error);
  }
}

export const updateDeviceManager = async (payload) => {
  try {
    const response = await post(DEVICE_MANAGER, payload);
    return responseHandler(response);
  } catch (error) {
    throw _handleError(error);
  }
}

export const switchDown = async () => {
  try {
    const response = await get(SWITCH_DOWN);
    return responseHandler(response);
  } catch (error) {
    throw _handleError(error);
  }
}



export function responseHandler(response) {
  const { outcome, payload } = response;
  if(outcome.status === 'success'){
    return payload;
  }else{
    throw response;
  }
}

export function _handleError(error) {
  var errorObj = {};
  if (typeof error === 'object' && error !== null) {
    errorObj = {
      code: error?.code,
      message: error?.message
    };
  } else {
    errorObj = {
      code: error,
      message: error
    };
  }

  //TODO:show error toast
  //logError(errorObj.code);
  return errorObj;
}