import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const post = (endPoint, payload) => {
  return axios.post(`${BASE_URL}${endPoint}`,payload).then((res)=>{
    return getDataResponse(res);
  }).catch((error)=>{
    manageError(error);
  })
}

export const patch = (endPoint, payload) => {
  return axios.patch(`${BASE_URL}${endPoint}`,payload).then((res)=>{
    return getDataResponse(res);
  }).catch((error)=>{
    manageError(error);
  })
}

export const get = (endPoint) => {
  return axios.get(`${BASE_URL}${endPoint}`).then((res)=>{
    return getDataResponse(res);
  }).catch((error)=>{
    manageError(error);
  })
}

const getDataResponse = (res) => {
  return res?.data;
}

const manageError = (error) => {
  console.log(error);
  throw error;
}