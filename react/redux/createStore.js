export default function createStore(reducer, defaultState, enhancer) {
  if (typeof enhancer !== "undefined") {
    return enhancer(createStore)(reducer, defaultState);
  }

  let listeners = [];

  let currentReducer = reducer;

  let currentState = defaultState;

  function dispatch(action) {
    currentState = currentReducer(currentState, action);
    for (let i = 0; i < listeners.length; i++) {
      listeners[i]();
    }
  }

  function getState() {
    return currentState;
  }

  function subscribe(listen) {
    listeners.push(listen);
    return function () {
      listeners = listeners.filter((item) => item !== listen);
    };
  }

  dispatch({
    type: "@@lyt-redux/init",
  });

  return {
    dispatch,
    getState,
    subscribe,
  };
}
