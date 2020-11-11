import React from "react";
import Form, { Field } from "../rc-form";

const RcFormDemo = () => {
  return (
    <div>
      <Form
        onFinished={(value) => console.log("success", value)}
        initialValue={{ username: "lyt", password: "222" }}
      >
        <Field name="username">
          <input placeholder="username" />
        </Field>
        <Field name="password">
          <input placeholder="password" />
        </Field>
        <button>提交</button>
      </Form>
    </div>
  );
};

export default RcFormDemo;
