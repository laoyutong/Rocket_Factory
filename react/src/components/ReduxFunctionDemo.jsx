import React from "react";
import { useDispatch, useSelector } from "../react-redux";
const ReduxFunctionDemo = () => {
  const { count, name } = useSelector((store) => store);

  const dispatch = useDispatch();

  const add = () => dispatch({ type: "ADD" });

  const change = (e) => dispatch({ type: "SET", payload: "凹凸曼" });
  return (
    <div>
      <div>
        function count: {count}
        <div>
          <button onClick={add}>++</button>
        </div>
      </div>
      <div>
        function name:{name}
        <div>
          <button onClick={change}>change</button>
        </div>
      </div>
    </div>
  );
};

export default ReduxFunctionDemo;
