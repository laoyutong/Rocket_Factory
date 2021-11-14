import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import produce from "immer";
import { useContext, useEffect, useState } from "react";
import { ReactReduxContext } from "react-redux";

export const configureStore = ({
  reducer,
  middleware = [thunk],
  preloadedState,
}) => {
  return createStore(
    typeof reducer === "function" ? reducer : combineReducers(reducer),
    preloadedState,
    applyMiddleware(...middleware)
  );
};

export const createAction = (type, prepareAction) => {
  const actionCreator = (payload) => ({
    type,
    payload: prepareAction ? prepareAction(payload).payload : payload,
  });
  actionCreator.type = type;
  return actionCreator;
};

export const createReducer = (initialState, actionsMap) => {
  return (state = initialState, action) => {
    const reducer = actionsMap[action.type];
    if (reducer) {
      return produce(state, (draft) => {
        reducer(draft, action);
      });
    }
    return state;
  };
};

export const createSlice = ({ name, initialState, reducers }) => {
  const actions = {};
  const prefixActionsMap = {};
  Object.keys(reducers).forEach((actionType) => {
    const prefixActionType = name + "/" + actionType;
    actions[actionType] = createAction(prefixActionType);
    prefixActionsMap[prefixActionType] = reducers[actionType];
  });
  return {
    reducer: createReducer(initialState, prefixActionsMap),
    actions,
  };
};

export const createAsyncThunk = (type, payloadCreator) => {
  const pending = createAction(type + "/pending");
  const fulfilled = createAction(type + "/fulfilled");
  const rejected = createAction(type + "/rejected");

  const actionCreator = (arg) => {
    return (dispatch) => {
      dispatch(pending());
      return payloadCreator(arg)
        .then((res) => {
          dispatch(fulfilled(res));
        })
        .catch((err) => {
          dispatch(rejected(err));
        });
    };
  };

  return Object.assign(actionCreator, {
    pending,
    fulfilled,
    rejected,
  });
};

export const fetchBaseQuery = ({ baseUrl }) => {
  return async function (url) {
    return await fetch(baseUrl + url).then((res) => res.json());
  };
};

const FETCH_DATA = "FETCH_DATA";

export const createApi = ({ reducerPath, baseQuery, endpoints }) => {
  const { reducer, actions } = createSlice({
    name: reducerPath,
    initialState: { data: undefined, error: undefined, isLoading: false },
    reducer: {
      setValue(state, action) {
        Object.keys(action.payload).forEach((k) => {
          state[k] = action.payload[k];
        });
      },
    },
  });

  const middleware = ({ dispatch }) => {
    return (next) => {
      return (action) => {
        if (action.type === FETCH_DATA) {
          (async () => {
            dispatch(actions.setValue({ isLoading: true }));
            try {
              const data = await baseQuery(action.payload.url);
              dispatch(actions.setValue({ isLoading: false, data }));
            } catch (error) {
              dispatch(actions.setValue({ isLoading: false, error }));
            }
          })();
        } else {
          next(action);
        }
      };
    };
  };

  const builder = {
    query(options) {
      return {
        useQuery: (arg) => {
          const { store } = useContext(ReactReduxContext);
          const [, forceUpdate] = useState([]);
          useEffect(() => {
            const unSubscribe = store.subscribe(() => forceUpdate([]));
            store.dispatch({
              type: FETCH_DATA,
              payload: { url: options.query(arg) },
            });
            return unSubscribe;
          }, []);
          return store.getState()[reducerPath];
        },
      };
    },
  };

  return {
    reducerPath,
    reducer,
    middleware,
    endpoints: endpoints(builder),
  };
};
