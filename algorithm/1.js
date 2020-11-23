/**
 * input 2[abc3[d]]
 * output abcdddabcddd
 */
function main(input) {
  const stack = [];
  const length = input.length;
  let result = "";
  let index = -1;
  let num = 0;
  while (++index < length) {
    const inputStr = input[index];
    if (!isNaN(+inputStr)) {
      num = +inputStr;
      continue;
    }
    if (inputStr === "[") {
      stack.push({
        str: "",
        num,
      });
      continue;
    }
    if (inputStr === "]") {
      const { str, num } = stack.pop();
      if (stack.length === 0) {
        result += str.repeat(num);
      } else {
        stack[stack.length - 1].str += str.repeat(num);
      }
      continue;
    }
    if (stack.length === 0) {
      result += inputStr;
    } else {
      stack[stack.length - 1].str += inputStr;
    }
  }
  return result;
}

main("abc4[d]");
