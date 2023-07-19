import { LOAD_CONFIGS, LOAD_CONFIGS_ERROR, LOAD_CONFIGS_SUCCESS } from "./actionTypes"

const initialState = {
  loadingConfigs: false,
  configs: null
}

const App = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_CONFIGS:
      state = {
        ...state,
        loadingConfigs:true,
      }
      break;
    case LOAD_CONFIGS_SUCCESS:
      state = {
        ...state,

        loadingConfigs: false,
        configs: action.payload,
      }
      break;
    case LOAD_CONFIGS_ERROR:
      state = {
        ...state,
        loadingConfigs: false,
      }
      break;
    default:
      state = { ...state }
      break
  }
  return state
}

export default App
