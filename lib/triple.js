'use strict';

const compare = require('./compare.js');
const isMaxNode = (node) =>
  node.s === Number.MAX_VALUE &&
  node.c === Number.MAX_VALUE;

/**
 * Triple that contains <path; site; counter>. Identifiers of LSEQ are lists of
 * triples.
 */
let Triple = (path, site, counter) => ({
    p: path,
    s: site,
    c: counter,
});

/**
 * Compare two triples prioritizing the path, then site, then counter.
 * @param {Triple} n the first triple to compare .
 * @param {Triple} o the other triple to compare .
 * @returns {Number} -1 if n is lower than o, 1 if n is greater than
 * o, 0 otherwise.
 */
let compareTriples = (n, o) =>
  // #1 process maximal virtual bounds
    isMaxNode(n) ? 1
  : isMaxNode(o) ? -1
  // #2 compare p then s then c
  : compare(n.p, o.p)
 || compare(n.s, o.s)
 || compare(n.c, o.c)
;


Triple.compare = compareTriples;
module.exports = Triple;
