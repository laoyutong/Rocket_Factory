import { useState } from "react";

export const atom = (config) => {
  let value = config.default;
  const node = {
    get() {
      return value;
    },
    set(newValue) {
      value = newValue;
    },
  };
  return node;
};

export const useRecoilValue = (recoilState) => {
  return recoilState.get();
};

export const useSetRecoilState = (recoilState) => {
  const [, setValue] = useState(0);
  return (newValue) => {
    recoilState.set(newValue);
    setValue((v) => v + 1);
  };
};

export const useRecoilState = (recoilState) => {
  return [useRecoilValue(recoilState), useSetRecoilState(recoilState)];
};
