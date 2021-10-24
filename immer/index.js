const isObject = (v) => Object.prototype.toString.call(v) === "[object Object]";
const isArray = (v) => Array.isArray(v);
const isFunction = (v) => typeof v === "function";

const CONFIG_KEY = Symbol("CONFIG_KEY");

const produce = (state, draftFn) => {
  const draft = toProxy(state);
  draftFn(draft);
  const { hasChange, draftState, baseState } = draft[CONFIG_KEY];
  return hasChange ? draftState : baseState;
};

const createDraftState = (state) => {
  if (isObject(state)) {
    return { ...state };
  }
  if (isArray(state)) {
    return [...state];
  }
  return state;
};

const toProxy = (baseState, onParentChange) => {
  const config = {
    baseState,
    draftState: createDraftState(baseState),
    hasChange: false,
    proxyMap: {},
  };

  return new Proxy(baseState, {
    get(target, key) {
      if (key === CONFIG_KEY) {
        return config;
      }

      const value = target[key];
      if (isArray(value) || isObject(value)) {
        if (!config.proxyMap[key]) {
          config.proxyMap[key] = toProxy(value, () => {
            config.hasChange = true;
            config.draftState[key] =
              config.proxyMap[key][CONFIG_KEY].draftState;
            onParentChange?.();
          });
        }
        return config.proxyMap[key];
      }

      if (isFunction(value)) {
        config.hasChange = true;
        onParentChange?.();
        return value.bind(config.draftState);
      }

      return config.hasChange ? config.draftState : config.baseState;
    },
    set(target, key, value) {
      if (target[key] === value) {
        return;
      }
      config.hasChange = true;
      config.draftState[key] = value;
      onParentChange?.();
    },
  });
};
