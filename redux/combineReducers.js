export default function combineReducers (reducers) {
  return function (state = {}, action) {
    const combineState = {};
    for (const key in reducers) {
      if (reducers.hasOwnProperty(key)) {
        combineState[key] = reducers[key](state[key], action);
      }
    }
    return combineState;
  };
}
