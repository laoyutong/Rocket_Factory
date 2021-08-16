import {
  memo,
  useState,
  useRef,
  FunctionComponent,
  MemoExoticComponent,
} from "react";

type Effect = () => void;
type ProxyKey = string | symbol;

const effectStack: Effect[] = [];

const targetMap = new WeakMap<object, Map<ProxyKey, Effect[]>>();

function isObject(v: any): boolean {
  return v && typeof v === "object";
}

function track(target: object, key: ProxyKey) {
  let deps = targetMap.get(target);
  if (!deps) {
    deps = new Map();
    targetMap.set(target, deps);
  }

  let effectList = deps.get(key);
  if (!effectList) {
    effectList = [];
    deps.set(key, effectList);
  }

  if (effectStack.length !== 0) {
    effectList.push(effectStack[effectStack.length - 1]);
  }
}

function triggle(target: object, key: ProxyKey) {
  let deps = targetMap.get(target);
  if (!deps) {
    return;
  }

  const effectList = deps.get(key);
  if (effectList) {
    effectList.forEach((effect) => effect());
  }
}

function createObserable(target: any) {
  if (!isObject(target)) {
    return target;
  }
  for (let i in target) {
    target[i] = createObserable(target[i]);
  }
  return new Proxy(target, {
    get(target, key) {
      track(target, key);
      return Reflect.get(target, key);
    },
    set(target, key, value) {
      const r = Reflect.set(target, key, value);
      triggle(target, key);
      return r;
    },
  });
}

function useObserver<T extends () => any>(component: T): ReturnType<T> {
  const [_, forceUpdate] = useState([]);

  const result = useRef<ReturnType<T>>();

  if (!result.current) {
    effectStack.push(() => forceUpdate([]));
    result.current = component();
    effectStack.pop();
  } else {
    result.current = component();
  }
  return result.current as ReturnType<T>;
}

function obserable<T extends object>(target: T): T {
  return createObserable(target);
}

function observer<T>(
  component: FunctionComponent<T>
): MemoExoticComponent<FunctionComponent> {
  const WrapperComponent = (props: any) => {
    return useObserver(() => component(props));
  };
  return memo(WrapperComponent as any);
}
