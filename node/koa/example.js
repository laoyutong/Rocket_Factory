const Koa = require("./koa");

const app = new Koa();

app.use((ctx, next) => {
  ctx.body = "222";
  console.log(111);
  next();
  console.log(222);
});

app.use((ctx, next) => {
  console.log(333);
  next();
  console.log(444);
});

app.listen(3000, () => {
  console.log("koa start");
});
