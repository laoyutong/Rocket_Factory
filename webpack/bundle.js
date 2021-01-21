(function (modules) {
  const moduleCache = {};
  function __webpack__require__(moduleId) {
    if (moduleCache[moduleId]) {
      return moduleCache[moduleId].exports;
    }
    const module = (moduleCache[moduleId] = {
      moduleId,
      exports: {},
    });
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack__require__
    );
    return module.exports;
  }
  return __webpack__require__("./src/index.js");
})({
  "./src/index.js": function (module, exports, __webpack__require__) {
    const title = __webpack__require__("./src/title.js");
    console.log(title);
  },
  "./src/title.js": function (module, exports) {
    module.exports = "hello world";
  },
});
