const http = require("http");

class Koa {
  constructor() {
    this.middlewares = [];
  }
  use(middleware) {
    this.middlewares.push(middleware);
  }
  listen(...args) {
    const server = http.createServer(async (req, res) => {
      const ctx = createContext(req, res);

      await compose(this.middlewares)(ctx);

      res.end(ctx.body);
    });
    server.listen(...args);
  }
}

const context = {
  get url() {
    return this.request.url;
  },
  get body() {
    return this.response.body;
  },
  set body(val) {
    this.response.body = val;
  },
  get method() {
    return this.request.method;
  },
};

const response = {
  get body() {
    return this._body;
  },
  set body(val) {
    this._body = val;
  },
};

const request = {
  get url() {
    return this.req.url;
  },

  get method() {
    return this.req.method.toLowerCase();
  },
};

function createContext(req, res) {
  const ctx = Object.create(context);
  ctx.response = Object.create(response);
  ctx.request = Object.create(request);
  ctx.request.req = req;
  ctx.response.res = res;
  return ctx;
}

function compose(middlewares) {
  return function (ctx) {
    return dispatch(0);
    function dispatch(i) {
      const fn = middlewares[i];
      if (!fn) {
        return Promise.resolve();
      } else {
        return Promise.resolve(
          fn(ctx, function next() {
            return dispatch(i + 1);
          })
        );
      }
    }
  };
}

module.exports = Koa;
