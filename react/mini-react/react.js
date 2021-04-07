let wipRoot = null;
let nextUnitOfWork = null;
let deletions = [];
let currentRoot = null;
let wipFiber = null;
let hookIndex = 0;

const TEXT_NODE = "TEXT_NODE";
const UPDATE = "UPDATE";
const PLACEMENT = "PLACEMENT";
const DELETION = "DELETION";

const createElement = (type, props, ...children) => ({
  type,
  props: {
    ...props,
    children: children.map((child) =>
      typeof child === "object" ? child : creatTextNode(child)
    ),
  },
});

const creatTextNode = (text) => ({
  type: TEXT_NODE,
  props: {
    nodeValue: text,
    children: [],
  },
});

const render = (element, container) => {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    base: currentRoot,
  };
  nextUnitOfWork = wipRoot;
  deletions = [];
};

const updateDom = (dom, prevProps, nextProps) => {
  Object.keys(prevProps)
    .filter((key) => key !== "children")
    .filter((key) => !(key in nextProps))
    .forEach((key) => {
      if (key.startsWith("on")) {
        const eventName = key.substring(2);
        dom.removeEventListener(eventName.toLowerCase(), prevProps[key]);
      } else {
        dom[key] = "";
      }
    });

  Object.keys(nextProps)
    .filter((key) => key !== "children")
    .filter((key) => prevProps[key] !== nextProps[key])
    .forEach((key) => {
      if (key.startsWith("on")) {
        const eventName = key.substring(2);
        dom.addEventListener(eventName.toLowerCase(), nextProps[key]);
      } else {
        dom[key] = nextProps[key];
      }
    });
};

const createDom = (fiber) => {
  const dom =
    fiber.type === TEXT_NODE
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
};

const reconcileChildren = (fiber, children) => {
  let index = 0;
  let prevSibling = 0;
  let oldFiber = fiber.base?.child;
  while (index < children.length || oldFiber) {
    let newFiber;
    const child = children[index];
    const sameType = child && oldFiber && child.type === oldFiber.type;
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: child.props,
        parent: fiber,
        dom: oldFiber.dom,
        base: oldFiber,
        effectTag: UPDATE,
      };
    }

    if (!sameType && child) {
      newFiber = {
        type: child.type,
        props: child.props,
        base: child,
        dom: null,
        parent: fiber,
        effectTag: PLACEMENT,
      };
    }

    if (!sameType && oldFiber) {
      oldFiber.effectTag = DELETION;
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }
};

const updateHostComponent = (fiber) => {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
};

const updateFunctionComponent = (fiber) => {
  hookIndex = 0;
  wipFiber = fiber;
  wipFiber.hooks = [];
  reconcileChildren(fiber, [fiber.type(fiber.props)]);
};

const performUnitOfWork = (fiber) => {
  typeof fiber.type === "function"
    ? updateFunctionComponent(fiber)
    : updateHostComponent(fiber);

  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
  return null;
};

const commitDeletion = (fiber, domParent) => {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
};

const commitWork = (fiber) => {
  if (!fiber) {
    return;
  }

  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;
  if (fiber.effectTag === PLACEMENT && fiber.dom) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === DELETION) {
    commitDeletion(fiber, domParent);
  } else if (fiber.effectTag === UPDATE && fiber.dom) {
    updateDom(fiber.dom, fiber.base.props, fiber.props);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
};

const workLoop = (deadline) => {
  if (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  if (!nextUnitOfWork && wipRoot) {
    deletions.forEach(commitWork);
    commitWork(wipRoot.child);
    currentRoot = wipRoot;
    wipRoot = null;
  }
  requestIdleCallback(workLoop);
};
requestIdleCallback(workLoop);

const useState = (initial) => {
  const oldHook = wipFiber.base?.hooks?.[hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };
  const actions = oldHook?.queue || [];
  actions.forEach((action) => {
    hook.state = typeof action === "function" ? action(hook.state) : action;
  });
  const setState = (action) => {
    hook.queue.push(action);
    wipRoot = {
      type: currentRoot.type,
      props: currentRoot.props,
      base: currentRoot,
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };
  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
};
