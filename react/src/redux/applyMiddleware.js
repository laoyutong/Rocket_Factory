import compose from "./compose";

export default function applyMiddleware(...middlewares) {
  return function (createStore) {
    return function (reducer, ...args) {
      const store = createStore(reducer, ...args);

      const simpleStore = {
        getState: store.getState,
        dispatch: store.dispatch,
      };
      const middlewaresChain = middlewares.map((middleware) =>
        middleware(simpleStore)
      );

      let dispatch = compose(...middlewaresChain)(store.dispatch);

      return {
        ...store,
        dispatch,
      };
    };
  };
}
