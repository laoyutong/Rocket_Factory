const getCurrentTime = () => performance.now();

const yieldInterval = 5;

const messagechannel = new MessageChannel();
const port1 = messagechannel.port1;
const port2 = messagechannel.port2;

const taskQueue = [];

const ImmediatePriority = 1;
const NormalPriority = 2;
const LowPriority = 3;

const IMMEDIATE_PRIORITY_TIMEOUT = -1;
const NORMAL_PRIORITY_TIMEOUT = 25;
const LOW_PRIORITY_TIMEOUT = 5000;

const TIMEOUT_CONFIG = {
  [ImmediatePriority]: IMMEDIATE_PRIORITY_TIMEOUT,
  [NormalPriority]: NORMAL_PRIORITY_TIMEOUT,
  [LowPriority]: LOW_PRIORITY_TIMEOUT,
};

let deadline;

let scheduledCallback;

let currentTask;

const shouldYield = () => {
  return getCurrentTime() >= deadline;
};

const requestCallback = (callback) => {
  scheduledCallback = callback;
  port2.postMessage(null);
};

const workLoop = (currentTime) => {
  currentTask = peek(taskQueue);
  while (currentTask) {
    if (currentTask.expirationTime > currentTime && shouldYield()) {
      break;
    }
    const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
    const newCallback = currentTask.callback(didUserCallbackTimeout);
    if (newCallback) {
      currentTask.callback = newCallback;
    } else {
      pop(taskQueue);
      currentTask = peek(taskQueue);
    }
  }
  return currentTask;
};

const scheduleCallback = (callback, priority) => {
  const timeout = TIMEOUT_CONFIG[priority];
  const startTime = getCurrentTime();
  const expirationTime = startTime + timeout;
  const newTask = {
    callback,
    priority,
    startTime,
    expirationTime,
    sortIndex: expirationTime,
  };
  push(taskQueue, newTask);
  requestCallback(workLoop);
};

port1.onmessage = () => {
  const currentTime = getCurrentTime();
  deadline = currentTime + yieldInterval;
  const hasMoreWork = scheduledCallback(currentTime);
  if (hasMoreWork) {
    port2.postMessage(null);
  }
};
