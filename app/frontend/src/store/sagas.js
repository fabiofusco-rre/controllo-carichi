import { all, fork } from "redux-saga/effects"

import LoadSaga from "./load/saga";

export default function* rootSaga() {
  yield all([
    fork(LoadSaga)
  ])
}
