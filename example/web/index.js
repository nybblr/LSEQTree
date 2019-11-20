import LSeqTree from '../../lib/lseqtree.js';
import {createPRNG} from '../../lib/random.js';
import drawTree from './draw-tree.js';

let flatten = (node) =>
  [node.e, ...node.children.flatMap(flatten)];

let toArray = (crdt) =>
  flatten(crdt.root);

let toString = (crdt) =>
  toArray(crdt).join('')

let seed = [ 6 ];
let random = createPRNG(seed);

const lseqAlex = new LSeqTree('alex', { base: 3, random });
const lseqBeth = new LSeqTree('beth', { base: 3, random });

// Alex makes some edits
let alexEdits = [
  lseqAlex.insert('s', 0),
  lseqAlex.insert('a', 1),
  lseqAlex.insert('n', 2),
  lseqAlex.insert('d', 3),
];

// Beth makes some edits concurrently
let bethEdits = [
  lseqBeth.insert('w', 0),
  lseqBeth.insert('h', 1),
  lseqBeth.insert('i', 2),
  lseqBeth.insert('c', 3),
  lseqBeth.insert('h', 4),
];

// Before sync up
console.log(`Alex's copy:\n${toString(lseqAlex)}`);
console.log(`Beth's copy:\n${toString(lseqBeth)}`);

alexEdits.map(edit =>
  lseqBeth.applyInsert(edit)
);
bethEdits.map(edit =>
  lseqAlex.applyInsert(edit)
);

// After sync up
console.log(`Alex's copy:\n${toString(lseqAlex)}`);
console.log(`Beth's copy:\n${toString(lseqBeth)}`);

window.alex = lseqAlex;
window.beth = lseqBeth;

let canvas = document.querySelector('svg.canvas');
drawTree(canvas, lseqAlex);
