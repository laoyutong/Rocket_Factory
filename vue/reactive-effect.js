const isObject = (obj) => typeof obj === "object" && obj !== null;

function reactive(obj) {
  if (!isObject(obj)) {
    return obj;
  }

  return new Proxy(obj, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      track(target, key);
      return reactive(result);
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      triggle(target, key);
      return result;
    },
  });
}

const effectStack = [];

const targetMap = new WeakMap();

function effect(cb) {
  effectStack.push(cb);
  cb();
  effectStack.pop();
}

function track(target, key) {
  const effect = effectStack[effectStack.length - 1];
  if (!effect) {
    return;
  }
  let depMap = targetMap.get(target);
  if (!depMap) {
    depMap = new Map();
    targetMap.set(target, depMap);
  }
  let deps = depMap.get(key);
  if (!deps) {
    deps = new Set();
    depMap.set(key, deps);
  }
  deps.add(effect);
}

function triggle(target, key) {
  const depMap = targetMap.get(target);
  if (!depMap) {
    return;
  }
  const deps = depMap.get(key);
  if (deps) {
    deps.forEach((dep) => dep());
  }
}

const state = reactive({ age: 0 });

effect(() => {
  console.log("effect", state.age);
});

setInterval(() => {
  state.age++;
}, 1000);
