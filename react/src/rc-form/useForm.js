import { useRef } from "react";

class FormStore {
  constructor() {
    this.state = {};
    this.callbacks = {};
  }
  setFieldValue = (name, value) => {
    this.state[name] = value;
  };
  getFieldValue = (name) => {
    return this.state[name];
  };
  setCallbacks = (callback) => {
    this.callbacks = {
      ...this.callbacks,
      ...callback,
    };
  };
  submit = () => {
    this.callbacks.onFinished(this.state);
  };
  getForm() {
    return {
      setFieldValue: this.setFieldValue,
      getFieldValue: this.getFieldValue,
      setCallbacks: this.setCallbacks,
      submit: this.submit,
    };
  }
}

export default function useForm() {
  const formIns = useRef();
  if (!formIns.current) {
    const formStore = new FormStore();
    formIns.current = formStore.getForm();
  }
  return [formIns.current];
}
