import React from "react";
import useForm from "./useForm";
import formContext from "./context";

const Form = ({ onFinished, children }) => {
  const [form] = useForm();
  form.setCallbacks({
    onFinished,
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.submit();
      }}
    >
      <formContext.Provider value={form}>{children}</formContext.Provider>
    </form>
  );
};

export default Form;
