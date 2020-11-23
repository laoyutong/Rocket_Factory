class List {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}
const a = new List(1);
const b = new List(2);
const c = new List(5);
const d = new List(4);
const e = new List(3);
a.next = b;
b.next = c;
c.next = d;
d.next = e;

function main(list) {
  const first = new List(0);
  const second = new List(0);
  let temp1 = first;
  let temp2 = second;
  while (list) {
    if (list.val % 2 === 0) {
      temp2.next = new List(list.val);
      temp2 = temp2.next;
    } else {
      temp1.next = new List(list.val);
      temp1 = temp1.next;
    }
    list = list.next;
  }
  temp1.next = second.next;
  return first.next;
}

console.log(main(a));
