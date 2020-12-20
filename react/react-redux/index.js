import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";

const storeCtx = createContext();

export function Provider({ store, children }) {
  return <storeCtx.Provider value={store}>{children}</storeCtx.Provider>;
}

export function useSelector(state) {
  const store = useStore();
  const forceUpdate = useForceUpdate();
  useLayoutEffect(() => {
    const sub = store.subscribe(() => forceUpdate());
    return () => sub();
  }, [forceUpdate, store]);
  return state(store.getState());
}

export function useDispatch() {
  const { dispatch } = useStore();
  return dispatch;
}

function useStore() {
  const store = useContext(storeCtx);
  return store;
}

export const connect = (mapPropsToState, mapDispatchToState) => (Cmp) => (
  props
) => {
  const store = useContext(storeCtx);
  const state = mapPropsToState(store.getState());
  const action = mapDispatchToState(store.dispatch);
  const forceUpdate = useForceUpdate();
  useLayoutEffect(() => {
    const sub = store.subscribe(() => forceUpdate());
    return () => sub();
  }, [forceUpdate, store]);

  const handledProps = {
    ...props,
    ...state,
    ...action,
  };

  return <Cmp {...handledProps} />;
};

function useForceUpdate() {
  const [, setState] = useState(0);
  const forceUpdate = useCallback(() => setState((p) => p + 1), []);
  return forceUpdate;
}
