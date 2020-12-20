import { memo, useEffect, useRef } from "react";

const viewHeight = document.documentElement.clientHeight;

function lazyload(el, src) {
  const elHeight = el.getBoundingClientRect().top;
  if (viewHeight > elHeight) {
    el.src = src;
  }
}

function throttle(callback, delay) {
  let flag = true;
  return () => {
    if (!flag) {
      return;
    }
    callback();
    flag = false;
    setTimeout(() => {
      flag = true;
    }, delay);
  };
}

const Lazyload = ({ src, ...props }) => {
  const imgRef = useRef();

  useEffect(() => {
    const lazyFn = throttle(() => lazyload(imgRef.current, src), 100);

    lazyFn();

    document.addEventListener("scroll", lazyFn);

    return () => {
      document.removeEventListener("scroll", lazyFn);
    };
  }, []);

  return <img {...props} ref={imgRef} />;
};

export default memo(Lazyload);
