/**
 * 自定义指令 v-lazy="xxx"
 * 实现图片懒加载
 */

const viewHeight = document.documentElement.clientHeight;

const loadImg = (el, binding) => {
  if (el.src.trim()) {
    return;
  }
  const elHeight = el.getBoundingClientRect().top;
  if (viewHeight > elHeight) {
    el.src = binding.value;
  }
};

const throttleFn = (callback, delay) => {
  let flag = true;
  return () => {
    if (!flag) {
      return;
    }
    flag = false;
    setTimeout(() => {
      flag = true;
      callback();
    }, delay);
  };
};

const cachedFn = new WeakMap();

const lazyLoad = {
  mounted(el, binding) {
    loadImg(el, binding);
    cachedFn.set(
      el,
      throttleFn(() => loadImg(el, binding), 100)
    );
    document.addEventListener("scroll", cachedFn.get(el), true);
  },

  unmounted(el) {
    document.removeEventListener("scroll", cachedFn.get(el), true);
  },
};

export default lazyLoad;
