import {
  LOAD_CONFIGS, LOAD_CONFIGS_ERROR, LOAD_CONFIGS_SUCCESS, UPDATE_PRIORITY, UPDATE_PRIORITY_ERROR, UPDATE_PRIORITY_SUCCESS
} from "./actionTypes"

export const loadConfigs = () => {
  return {
    type: LOAD_CONFIGS,
    payload: null,
  }
}
export const loadConfigsSuccess = configs => {
  return {
    type: LOAD_CONFIGS_SUCCESS,
    payload: configs,
  }
}
export const loadConfigsError = (error) => {
  return {
    type: LOAD_CONFIGS_ERROR,
    payload: error,
  }
}

export const updatePriority = (entityId, priority, upPriority) => {
  return {
    type: UPDATE_PRIORITY,
    payload: {entityId, priority, upPriority},
  }
}
export const updatePrioritySuccess = configs => {
  return {
    type: UPDATE_PRIORITY_SUCCESS,
    payload: configs,
  }
}
export const updatePriorityError = (error) => {
  return {
    type: UPDATE_PRIORITY_ERROR,
    payload: error,
  }
}


