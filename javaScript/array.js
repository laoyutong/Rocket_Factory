Array.prototype.sforEach = sforEach;
Array.prototype.smap = smap;
Array.prototype.sfilter = sfilter;
Array.prototype.sreduce = sreduce;

function sforEach(callback) {
  const arr = this;
  const length = arr.length;
  for (let i = 0; i < length; i++) {
    callback(arr[i], i, arr);
  }
}

function smap(callback) {
  const arr = this;
  const result = [];
  let index = 0;
  const length = arr.length;
  for (let i = 0; i < length; i++) {
    result[index++] = callback(arr[i], i, arr);
  }
  return result;
}

function sfilter(callback) {
  const arr = this;
  const result = [];
  let index = 0;
  const length = arr.length;
  for (let i = 0; i < length; i++) {
    if (callback(arr[i], i, arr)) {
      result[index++] = arr[i];
    }
  }
  return result;
}

function sreduce(callback, initialValue) {
  const arr = this;
  const length = arr.length;
  let accumulator = initialValue || arr[0];
  let start = initialValue ? 0 : 1;
  for (let i = start; i < length; i++) {
    accumulator = callback(accumulator, arr[i], i, arr);
  }
  return accumulator;
}
