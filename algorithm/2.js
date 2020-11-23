class Tree {
  constructor(val) {
    this.val = val;
    this.left = this.right = null;
  }
}
const a1 = new Tree(1);
const a2 = new Tree(3);
const a3 = new Tree(2);
const a4 = new Tree(5);

a1.left = a2;
a1.right = a3;
a2.left = a4;

const b1 = new Tree(2);
const b2 = new Tree(1);
const b3 = new Tree(3);
const b4 = new Tree(4);
const b5 = new Tree(7);
b1.left = b2;
b1.right = b3;
b2.right = b4;
b3.right = b5;

function mergeTrees(t1, t2) {
  if (!t1 || !t2) {
    return t1 || t2;
  }
  t1.val *= t2.val;
  t1.left = mergeTrees(t1.left, t2.left);
  t1.right = mergeTrees(t1.right, t2.right);
  return t1;
}

console.log(mergeTrees(a1, b1));
