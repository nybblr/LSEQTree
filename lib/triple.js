'use strict';

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
let compare = (n, o) =>
  // #1 process maximal virtual bounds
    n.s === Number.MAX_VALUE && n.c === Number.MAX_VALUE ? 1
  : o.s === Number.MAX_VALUE && o.s === Number.MAX_VALUE ? -1
  // #2 compare p then s then c
  : n.p < o.p ? -1
  : n.p > o.p ? 1
  : n.s < o.s ? -1
  : n.s > o.s ? 1
  : n.c < o.c ? -1
  : n.c > o.c ? 1
  : 0
;

Triple.compare = compare;
module.exports = Triple;
