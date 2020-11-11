import React, { useContext, cloneElement } from "react";
import fieldContext from "./context";

const Field = ({ children, name }) => {
  const { getFieldValue, setFieldValue } = useContext(fieldContext);

  const handledChild = cloneElement(children, {
    ...children.props,
    value: getFieldValue(name),
    onChange: (e) => setFieldValue(name, e.target.value),
  });

  return <div>{handledChild}</div>;
};

export default Field;
