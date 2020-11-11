import { Provider } from "./react-redux";
import store from "./components/store";

import RcFormDemo from "./components/RcFormDemo";
import ReduxFunctionDemo from "./components/ReduxFunctionDemo";
import ReduxClassDemo from "./components/ReduxClassDemo";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <RcFormDemo />
        <ReduxFunctionDemo />
        <ReduxClassDemo />
      </Provider>
    </div>
  );
}

export default App;
