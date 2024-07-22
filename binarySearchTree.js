// Node class
class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

// Tree class
class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  buildTree(array) {
    array = [...new Set(array)].sort((a, b) => a - b);
    return this.buildBST(array);
  }

  buildBST(array) {
    if (array.length === 0) return null;

    const mid = Math.floor(array.length / 2);
    const node = new Node(array[mid]);

    node.left = this.buildBST(array.slice(0, mid));
    node.right = this.buildBST(array.slice(mid + 1));

    return node;
  }

  insert(value) {
    this.root = this._insert(this.root, value);
  }

  _insert(node, value) {
    if (node === null) return new Node(value);

    if (value < node.data) {
      node.left = this._insert(node.left, value);
    } else if (value > node.data) {
      node.right = this._insert(node.right, value);
    }

    return node;
  }

  deleteItem(value) {
    this.root = this._delete(this.root, value);
  }

  _delete(node, value) {
    if (node === null) return null;

    if (value < node.data) {
      node.left = this._delete(node.left, value);
    } else if (value > node.data) {
      node.right = this._delete(node.right, value);
    } else {
      if (node.left === null) return node.right;
      if (node.right === null) return node.left;

      let minLargerNode = this._getMin(node.right);
      node.data = minLargerNode.data;
      node.right = this._delete(node.right, minLargerNode.data);
    }

    return node;
  }

  _getMin(node) {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }

  find(value) {
    return this._find(this.root, value);
  }

  _find(node, value) {
    if (node === null || node.data === value) return node;

    if (value < node.data) {
      return this._find(node.left, value);
    } else {
      return this._find(node.right, value);
    }
  }

  levelOrder(callback) {
    const result = [];
    if (this.root === null) return callback ? null : result;

    const queue = [this.root];

    while (queue.length > 0) {
      const node = queue.shift();
      if (callback) {
        callback(node);
      } else {
        result.push(node.data);
      }

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    return result;
  }

  inOrder(callback) {
    const result = [];
    this._inOrder(this.root, callback, result);
    return result;
  }

  _inOrder(node, callback, result) {
    if (node === null) return;

    this._inOrder(node.left, callback, result);

    if (callback) {
      callback(node);
    } else {
      result.push(node.data);
    }

    this._inOrder(node.right, callback, result);
  }

  preOrder(callback) {
    const result = [];
    this._preOrder(this.root, callback, result);
    return result;
  }

  _preOrder(node, callback, result) {
    if (node === null) return;

    if (callback) {
      callback(node);
    } else {
      result.push(node.data);
    }

    this._preOrder(node.left, callback, result);
    this._preOrder(node.right, callback, result);
  }

  postOrder(callback) {
    const result = [];
    this._postOrder(this.root, callback, result);
    return result;
  }

  _postOrder(node, callback, result) {
    if (node === null) return;

    this._postOrder(node.left, callback, result);
    this._postOrder(node.right, callback, result);

    if (callback) {
      callback(node);
    } else {
      result.push(node.data);
    }
  }

  height(node) {
    if (node === null) return -1;
    return 1 + Math.max(this.height(node.left), this.height(node.right));
  }

  depth(node) {
    let current = this.root;
    let depth = 0;

    while (current !== null && current !== node) {
      if (node.data < current.data) {
        current = current.left;
      } else {
        current = current.right;
      }
      depth++;
    }

    return current === null ? -1 : depth;
  }

  isBalanced() {
    return this._isBalanced(this.root);
  }

  _isBalanced(node) {
    if (node === null) return true;

    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    return (
      Math.abs(leftHeight - rightHeight) <= 1 &&
      this._isBalanced(node.left) &&
      this._isBalanced(node.right)
    );
  }

  rebalance() {
    const sortedArray = this.inOrder(); // Get sorted nodes
    this.root = this.buildTree(sortedArray); // Rebuild balanced tree
  }
}

// Pretty print function
const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

// Driver script
const generateRandomNumbers = (count, max) => {
  const numbers = new Set();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * max));
  }
  return Array.from(numbers);
};

const randomNumbers = generateRandomNumbers(16, 100);
const tree = new Tree(randomNumbers);

console.log("Initial Tree:");
prettyPrint(tree.root);
console.log("Is balanced:", tree.isBalanced());

console.log("Level Order:", tree.levelOrder());
console.log("Pre Order:", tree.preOrder());
console.log("In Order:", tree.inOrder());
console.log("Post Order:", tree.postOrder());

for (let i = 101; i <= 110; i++) {
  tree.insert(i);
}

console.log("Tree after adding nodes > 100:");
prettyPrint(tree.root);
console.log("Is balanced after adding nodes > 100:", tree.isBalanced());

tree.rebalance();
console.log("Tree after rebalancing:");
prettyPrint(tree.root);
console.log("Is balanced after rebalancing:", tree.isBalanced());

console.log("Level Order after rebalancing:", tree.levelOrder());
console.log("Pre Order after rebalancing:", tree.preOrder());
console.log("In Order after rebalancing:", tree.inOrder());
console.log("Post Order after rebalancing:", tree.postOrder());
