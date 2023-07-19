import { takeEvery, put, call } from "redux-saga/effects"
import { loadConfigsError, loadConfigsSuccess } from "./actions"
import { LOAD_CONFIGS, UPDATE_PRIORITY } from "./actionTypes"
import { getConfigs, postPriority } from "../../service/LoadService";


function* loadConfigs() {
  try {
    const configs = yield call(getConfigs);
    yield put(loadConfigsSuccess(configs));
  } catch (error) {
    yield put(loadConfigsError())
  }
}

function* updatePriority({payload: {entityId, priority, upPriority}}) {
  try {
    const configs = yield call(postPriority, {entityId, priority, upPriority});
    yield put(loadConfigsSuccess(configs));
  } catch (error) {
    yield put(loadConfigsError())
  }
}

function* AppSaga() {
  yield takeEvery(LOAD_CONFIGS, loadConfigs);
  yield takeEvery(UPDATE_PRIORITY, updatePriority);
}

export default AppSaga
