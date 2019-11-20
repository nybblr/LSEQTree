# LSEQTree

Watch a 30-minute talk on LSEQ and related concurrent data structures:

[What CRDTs, distributed editing and the speed of light means to your writer friends @ JSConf Colombia 2017](https://www.youtube.com/watch?v=2R6hc0WSHR8&list=PL1TdLOqoRHbrU4Yje0DbE_E4q-4DrvKPb&index=2)

*Keywords: distributed systems, collaborative editing, CRDT, LSEQ allocation strategy, unique identifiers, tree-based array*

This project aims to provide an implementation of a CRDT-based array [1] with an underlying exponential tree and the allocation strategy LSeq [2].

## Example

```javascript
// LSEQ for site #1
let lseq1 = new LSeqTree(1);
// LSEQ for site #2 (e.g. on another machine)
let lseq2 = new LSeqTree(2);

// Insert "A" into site #1's copy
let idInsert = lseq1.insert('A', 0);

// Relay site #1's change to site #2
lseq2.applyInsert(idInsert);

// Site #2 now has site #1's insert
console.log(lseq2.get(0)); // => A

// Delete character "A" from site #2's copy
let idDelete = lseq2.remove(0);

// Relay site #2's delete to site #1
lseq1.applyRemove(idDelete);

// Both sites should have empty copies
console.log(lseq1.length); // => 0
console.log(lseq2.length); // => 0
```

## Misc

* [Clojure LSEQTree](https://github.com/Tavistock/lseq-tree.git) from
[Travis McNeill](https://github.com/Tavistock)

* [Prior project](https://github.com/chat-wane/lseqarray.git) ~~follows the
specification of LSEQTree~~. Nevertheless, the former is a linearization of the 
tree into an array. As such, the memory usage is high. On the other hand,
LSEQTree uses a tree, and therefore, it has a better space complexity. LSEQTree
uses the core of the prior project to generate its identifiers.
Despite being less efficient (obviously, the code must be improved), ~~it
provides interoperability and interchangeability between the two projects~~.

## References

[1] M. Shapiro, N. Preguiça, C. Baquero, and M. Zawirski. [A comprehensive study
of Convergent and Commutative Replicated Data
Types](http://hal.upmc.fr/docs/00/55/55/88/PDF/techreport.pdf). *Research
Report.* 2011.

[2] B. Nédelec, P. Molli, A. Mostéfaoui, and E. Desmontils. [LSEQ: an Adaptive
Structure for Sequences in Distributed Collaborative
Editing](http://hal.archives-ouvertes.fr/docs/00/92/16/33/PDF/fp025-nedelec.pdf).
*DocEng '13 Proceedings of the 2013 ACM symposium on Document engineering. Pages
37-46.* Sept. 2013.
