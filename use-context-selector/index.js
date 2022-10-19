import {
  useEffect,
  useRef,
  useReducer,
  createContext as createOriginContext,
  createElement,
  useContext,
} from "react";

export const createContext = (defaultValue) => {
  const context = createOriginContext(defaultValue);
  context.Provider = createProvider(context.Provider);
  return context;
};

const createProvider = (OriginProvider) => {
  const ContextProvider = ({ value, children }) => {
    const contextValue = useRef();
    if (!contextValue.current) {
      contextValue.current = {
        value,
        listeners: new Set(),
      };
    }

    useEffect(() => {
      contextValue.current.value = value;
      contextValue.current.listeners.forEach((item) => item());
    }, [value]);

    return createElement(
      OriginProvider,
      { value: contextValue.current },
      children
    );
  };
  return ContextProvider;
};

export const useContextSelector = (contextIns, selector) => {
  const contextValue = useContext(contextIns);
  const selected = selector(contextValue.value);

  const [state, dispatch] = useReducer(
    (pre) => {
      if (selector(pre[0]) === selected) {
        return pre;
      }
      return [contextValue.value, selected];
    },
    [contextValue.value, selected]
  );

  useEffect(() => {
    contextValue.listeners.add(dispatch);
    return () => {
      contextValue.listeners.delete(dispatch);
    };
  }, [contextValue.listeners]);

  return state[1];
};
