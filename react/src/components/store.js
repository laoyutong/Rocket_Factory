import { createStore, combineReducers } from "../redux";

function count(state = 0, action) {
  const { type } = action;
  switch (type) {
    case "ADD":
      return state + 1;
    default:
      return state;
  }
}

function name(state = "匿名", action) {
  const { type, payload } = action;
  switch (type) {
    case "SET":
      return payload;
    default:
      return state;
  }
}

const store = createStore(combineReducers({ count, name }));

export default store;
